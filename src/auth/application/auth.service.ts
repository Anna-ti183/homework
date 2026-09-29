import { UsersRepository } from "../../users/repositories/users.repository";
import { AuthAttributes, NewPasswordDTO, PasswordRecoveryDTO, RegistrConfirmDTO, RegistrDTO, RegistrEmailResending } from "./dtos/auth.attributes";
import { argon2Service } from "../adapters/argon2.service";
import { jwtService } from "../adapters/jwt.service";
import { nodemailerService } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/email.service";
import { randomUUID, verify } from "crypto";
import { IUserDB } from "../../users/domain/users";
import { BadRequestException } from "../../core/exceptions/bad-request.exception";
import ms from 'ms';
import { SETTINGS } from "../../settings/config";
import { Session } from "inspector";
import { securityDevicesOutput } from "../../securityDevices/output/securityDevices.output";
import { NotFoundException } from "../../core/exceptions/not-found.exception";
import { ForbiddenException } from "../../core/exceptions/forbidden.exception";
import { inject, injectable } from "inversify";

@injectable()
export class AuthService {
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository) { }

    // 1. Ищем пользователя по логину ИЛИ email
    async loginUser(dto: AuthAttributes, ip: string, deviceName: string): Promise<{ accessToken: string, refreshToken: string } | null> {

        const user = await this.usersRepository.findByLoginOrEmail(
            dto.loginOrEmail,
            dto.loginOrEmail,
        );

        // 2. Если пользователь не найден
        if (!user) return null;

        // 3. Проверяем пароль
        const isValid = await argon2Service.checkPassword(dto.password, user.password); //dto.password - обычный пароль, user.password - хеш из БД

        // 4. Если пароль неверный
        if (!isValid) return null;

        // 5. Генерируем id для deviceId
        const deviceId = randomUUID();

        //6. Создаем новый accessToken и refreshToken 
        const accessToken = await jwtService.createAccessToken(user._id.toString());
        const refreshToken = await jwtService.createRefreshToken(user._id.toString(), deviceId);

        //7. Создаем payload для для создания сессии (тут хранятся  iat и exp)
        const payload = await jwtService.verifyToken(refreshToken)

        if (!payload) return null;

        const iat = payload.iat //достаём iat из  jwtService.verifyToken
        const exp = payload.exp //достаём exp из  jwtService.verifyToken

        //8.создаем новую сессию 
        const newSession = {
            user_id: user._id.toString(),
            device_id: deviceId,
            iat: iat,
            device_name: deviceName,
            ip: ip,
            exp: exp,
            lastActiveDate: new Date()
        }

        //9. сохранем в репозит для отправки в БД
        await this.usersRepository.createSession(newSession)

        return { accessToken, refreshToken };
    }

    //регистрация пользователя
    async registrUser(dto: RegistrDTO): Promise<boolean> {
        const user = await this.usersRepository.findByLoginOrEmail(
            dto.login,
            dto.email,
        );
        //проверить существует ли уже юзер с таким логином или почтой и если да - не регистрировать
        if (user) {
            if (user.login === dto.login) {
                throw new BadRequestException([
                    {
                        message: "Login already exists",
                        field: "login"
                    }
                ]);
            }

            if (user.email === dto.email) {
                throw new BadRequestException([
                    {
                        message: "Email already exists",
                        field: "email"
                    }
                ]);
            }
        };

        const createHash = await argon2Service.generateHash(dto.password); //создать хэш пароля

        const newUser: IUserDB = { // сформировать dto юзера
            login: dto.login,
            email: dto.email,
            password: createHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: { // доп поля необходимые для подтверждения
                confirmationCode: randomUUID(),
                expirationDate: new Date(Date.now() + 90 * 60 * 1000),
                isConfirmed: false //подтверждение 
            }

        };
        await this.usersRepository.create(newUser) // сохранить юзера в базе данных

        //отправку сообщения лучше обернуть в try-catch, чтобы при ошибке(например отвалиться отправка) приложение не падало
        try {
            await nodemailerService.sendEmail( //отправить сообщение на почту юзера с кодом подтверждения
                newUser.email, //кому отправляем
                newUser.emailConfirmation.confirmationCode, //какой код вставляем в письмо
                emailExamples.registrationEmail //какое письмо отправляем
            )
        } catch (e: unknown) {
            console.error('Send email error', e); //залогировать ошибку при отправке сообщения
        }
        return true;
    }

    //Подтверждение регистрации пользователя
    async registrConfirmUser(dto: RegistrConfirmDTO): Promise<boolean> {
        const user = await this.usersRepository.findByCode(dto.code);

        //усли пользователь по коду не найден
        if (!user) {
            throw new BadRequestException([
                {
                    message: "Confirmation code is incorrect",
                    field: "code"
                }
            ]);
        }

        //если код просрочен
        if (Date.now() > user.emailConfirmation.expirationDate.getTime()) { //getTime() - получить число из Date для сравнения общих типов(number)
            throw new BadRequestException([
                {
                    message: "Confirmation code is expired",
                    field: "code"
                }
            ]);
        }

        //если код использован
        if (user.emailConfirmation.isConfirmed === true) {
            throw new BadRequestException([
                {
                    message: "Confirmation code has already been applied",
                    field: "code"
                }
            ]);
        }

        await this.usersRepository.update(user._id.toString()) //находим по id польз-я и обновляем его isConfirmed

        return true
    }

    //Повторная отправка письма для регистрации
    async registrEmailResending(dto: RegistrEmailResending): Promise<boolean> {
        //нашли польз-ля
        const user = await this.usersRepository.findByEmail(dto.email)

        if (!user) {
            throw new BadRequestException([
                {
                    message: "User with this email does not exist",
                    field: "email"
                }
            ])
        }

        //если польз-ль подтвержен то мы ему повторно код не отправляем
        if (user.emailConfirmation.isConfirmed === true) {
            throw new BadRequestException([
                {
                    message: "Email is already confirmed",
                    field: "email"
                }
            ]);
        }

        //создали новый confirmationCode и expirationDate
        const confirmationCode = randomUUID();
        const expirationDate = new Date(Date.now() + 90 * 60 * 1000);

        //обновили в БД
        await this.usersRepository.updateCode(
            user._id.toString(),
            confirmationCode,
            expirationDate
        )

        //отправили письмо
        try {
            await nodemailerService.sendEmail( //отправить сообщение на почту юзера с кодом подтверждения
                user.email, //кому отправляем
                confirmationCode, //какой код вставляем в письмо
                emailExamples.registrationEmail //какое письмо отправляем
            )
        } catch (e: unknown) {
            console.error('Send email error', e); //залогировать ошибку при отправке сообщения
        }

        // если польз-ль не подтвержден отправляем повторно 
        return true;
    }


    async refreshTokens(oldRefreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {

        //проверяем что refreshToken — настоящий и не просроченный
        const refTokenPayload = await jwtService.verifyToken(oldRefreshToken) //refTokenPayload — это payload проверенного refresh-токена.
        if (refTokenPayload === null) return null;

        //взять deviceId и userId и iat из refToken
        const deviceId = refTokenPayload.deviceId;
        const userId = refTokenPayload.userId;

        //находим конкретную сессию - конкретного пользователя на конкретном устройстве
        const session = await this.usersRepository.findBySession(userId, deviceId)
        if (!session) return null;

        //проверяем соответствует ли текущий refreshToken той Session, которую мы нашли
        const iatJwt = refTokenPayload.iat;
        const iatSession = session.iat;
        if (iatJwt !== iatSession) return null;

        //если 3 проверки прошли создаем новую пару 
        const accessToken = await jwtService.createAccessToken(userId);
        const refreshToken = await jwtService.createRefreshToken(userId, deviceId);

        //вынимаем iat и exp из нового refreshToken для обновления сессии
        const refToken = await jwtService.verifyToken(refreshToken)
        if (!refToken) return null;
        const newIat = refToken.iat;
        const newExp = refToken.exp;

        //создаем новую дату начала сессии
        const lastActiveDate = new Date();

        //обновляем текущую сессию 
        await this.usersRepository.updateSession(userId, deviceId, newIat, newExp, lastActiveDate)

        return { accessToken, refreshToken };
    }



    async logout(oldRefreshToken: string): Promise<boolean> {

        //проверяем что refreshToken — настоящий и не просроченный
        const refTokenPayload = await jwtService.verifyToken(oldRefreshToken) //refTokenPayload — это payload проверенного refresh-токена.
        if (refTokenPayload === null) return false; //JWT невалидный или истёк 

        //взять deviceId и userId и iat из refToken - для соответствия refToken с текущей сессией
        const userId = refTokenPayload.userId;
        const deviceId = refTokenPayload.deviceId;
        const iatJwt = refTokenPayload.iat

        //нашли Session по userId + deviceId
        const session = await this.usersRepository.findBySession(userId, deviceId)
        if (!session) return false;

        //проверили, что iat JWT совпадает с iat Session
        const iatSession = session.iat;
        if (iatJwt !== iatSession) return false;

        //удаляем сессию
        await this.usersRepository.deleteSession(userId, deviceId);

        return true;
    }


    //SECURITYDEVICES
    //получаем все сессии
    async securityDevices(userId: string): Promise<securityDevicesOutput[]> {
        //получаем все сессии конкретного пользователя
        const activeSessions = await this.usersRepository.allSessions(userId);

        //преобразуем Session в DeviceOutput
        return activeSessions.map((session) => ({
            ip: session.ip,
            title: session.device_name,
            lastActiveDate: session.lastActiveDate,
            deviceId: session.device_id
        }))

    }

    //удалить все сессии кроме текущей
    async deleteSecurityDevicesExpectOne(userId: string, deviceId: string): Promise<void> {
        await this.usersRepository.deleteSecDevExpectCurrent(userId, deviceId)
    }

    //удалить только текущую сессию
    async deleteOneSession(userId: string, deviceId: string): Promise<void> {

        // Ищем Session по  deviceId
        const oneSession = await this.usersRepository.findByDeviceId(deviceId)
        if (!oneSession) {
            throw new NotFoundException('Session not found')
        }

        //сравниваем  user_id сессии с  user_id из JWT
        const userIdSession = oneSession.user_id;
        if (userId !== userIdSession) {
            throw new ForbiddenException('Invalid user')
        }

        //удаляем сессию которую пользователь указал через :deviceId
        await this.usersRepository.deleteOneSession(deviceId)

    }

    //ВОССТАНОВЛЕНИЕ ПОРОЛЯ
    async passwordRecovery(dto: PasswordRecoveryDTO): Promise<void> {
        const user = await this.usersRepository.findByEmail(dto.email)
        if (!user) return;

        //Новый сгенерированный код и дата истечения его срока  действия 
        const passwordRecoveryCode = randomUUID();
        const expirationPasswordDate = new Date(Date.now() + 10 * 60 * 1000); //текущее время + 10 минут


        //обновили в БД
        await this.usersRepository.updatePasswordCode(
            user._id.toString(),
            passwordRecoveryCode,
            expirationPasswordDate
        )

        //отправили письмо
        try {
            await nodemailerService.sendEmail( //отправить сообщение на почту юзера с кодом подтверждения
                user.email, //кому отправляем
                passwordRecoveryCode, //какой код вставляем в письмо
                emailExamples.passwordRecovery //какое письмо отправляем
            )
        } catch (e: unknown) {
            console.error('Send email error', e); //залогировать ошибку при отправке сообщения
        }

        return;
    }

    //НОВЫЙ ПАРОЛЬ
    async createNewPassword(dto: NewPasswordDTO): Promise<boolean> {
        const user = await this.usersRepository.findByRecoveryCode(dto.recoveryCode)
        if (!user) return false;

        //проверяем отсутствует ли объект
        if (!user.passwordRecovery) return false;

        //проверяем дату до которой действителен код
        if (user.passwordRecovery.expirationPasswordDate < new Date()) return false;

        //создать хэш пароля
        const createHashNewPassword = await argon2Service.generateHash(dto.newPassword);

        //сохраняем новый пароль
        await this.usersRepository.updatePassword(user._id.toString(), createHashNewPassword)

        //удаляем использованый код
        await this.usersRepository.deletePasswordCode(user._id.toString())


        return true;
    }
}
