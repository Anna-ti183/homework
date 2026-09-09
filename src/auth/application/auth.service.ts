import { usersRepository } from "../../users/repositories/users.repository";
import { AuthAttributes, RegistrConfirmDTO, RegistrDTO, RegistrEmailResending } from "./dtos/auth.attributes";
import { argon2Service } from "../adapters/argon2.service";
import { jwtService } from "../adapters/jwt.service";
import { nodemailerService } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/email.service";
import { randomUUID } from "crypto";
import { IUserDB } from "../../users/domain/users";
import { BadRequestException } from "../../core/exceptions/bad-request.exception";
import { refreshTokenBlacklist } from "../../blacklist-refreshtoken/repositories/refreshToken-blacklist.repository";
import ms from 'ms';
import { SETTINGS } from "../../settings/config";
import { blacklistCollection } from "../../db/collections";



export const authService = {

    // 1. Ищем пользователя по логину ИЛИ email
    async loginUser(dto: AuthAttributes): Promise<{ accessToken: string, refreshToken: string } | null> {
        const user = await usersRepository.findByLoginOrEmail(
            dto.loginOrEmail,
            dto.loginOrEmail,
        );

        // 2. Если пользователь не найден
        if (!user) {
            return null;
        }

        // 3. Проверяем пароль
        const isValid = await argon2Service.checkPassword(dto.password, user.password); //dto.password - обычный пароль, user.password - хеш из БД

        // 4. Если пароль неверный
        if (!isValid) {
            return null;
        }

        const accessToken = await jwtService.createAccessToken(user._id.toString());
        const refreshToken = await jwtService.createRefreshToken(user._id.toString());

        return { accessToken, refreshToken };
    },

    //регистрация пользователя
    async registrUser(dto: RegistrDTO): Promise<boolean> {
        const user = await usersRepository.findByLoginOrEmail(
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
        await usersRepository.create(newUser) // сохранить юзера в базе данных

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
    },

    //Подтверждение регистрации пользователя
    async registrConfirmUser(dto: RegistrConfirmDTO): Promise<boolean> {
        const user = await usersRepository.findByCode(dto.code);

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

        await usersRepository.update(user._id.toString()) //находим по id польз-я и обновляем его isConfirmed

        return true
    },

    //Повторная отправка письма для регистрации
    async registrEmailResending(dto: RegistrEmailResending): Promise<boolean> {
        //нашли польз-ля
        const user = await usersRepository.findByEmail(dto.email)

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
        await usersRepository.updateCode(
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
    },

    //Мы проверяем старый refresh token, запрещаем его повторное использование через blacklist 
    //и выдаём пользователю новую пару access/refresh токенов.
    async refreshTokens(oldRefreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {

        const refTokenPayload = await jwtService.verifyToken(oldRefreshToken) //refTokenPayload — это payload проверенного refresh-токена.
        if (refTokenPayload === null) return null; //токен невалидный или истёк 

        const token = await refreshTokenBlacklist.findByToken(oldRefreshToken)//передаём в репозиторий старый refreshToken
        if (token) return null; // если есть в БД тогда не используем

        const userId = refTokenPayload.userId //достаем из refTokenPayload наш userId

        const expiresAt = new Date(Date.now() + ms(SETTINGS.RT_TIME)); //20 c

        //Добавили старый token в blacklist
        const refreshTokens = {
            token: oldRefreshToken,
            userId: userId,
            expiresAt: expiresAt
        }
        await refreshTokenBlacklist.create(refreshTokens) //старый refreshToken отправили в Blacklist

        //Создали новую пару
        const accessToken = await jwtService.createAccessToken(userId);
        const refreshToken = await jwtService.createRefreshToken(userId);

        return { accessToken, refreshToken };
    },

    async logout(oldRefreshToken: string): Promise<boolean> {
        const refTokenPayload = await jwtService.verifyToken(oldRefreshToken) //refTokenPayload — это payload проверенного refresh-токена.
        if (refTokenPayload === null) return false; //JWT невалидный или истёк 

        const userId = refTokenPayload.userId //достаем из refTokenPayload наш userId

        const tokenBlackList = await refreshTokenBlacklist.findByToken(oldRefreshToken) // JWT ищем в blacklist

        if (tokenBlackList) return false; //есть в blacklist → false


        const expiresAt = new Date(Date.now() + ms(SETTINGS.RT_TIME)); //20 c

        //Добавляем старый token в blacklist
        const refreshTokens = {
            token: oldRefreshToken,
            userId: userId,
            expiresAt: expiresAt
        }
        await refreshTokenBlacklist.create(refreshTokens) //старый refreshToken отправили в Blacklist
        return true;
    }
}
