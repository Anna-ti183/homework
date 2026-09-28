import { IUserDB } from "../domain/users";
import { UsersRepository } from "../repositories/users.repository";
import { UserAttributes } from "./dtos/user-attributes";
import argon2 from "argon2";
import { BadRequestException } from "../../core/exceptions/bad-request.exception";
import { argon2Service } from "../../auth/adapters/argon2.service";
import { randomUUID } from "crypto";
import { inject, injectable } from "inversify";

@injectable()
export class UsersService { 
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository){}

    //Создать нового юзера
    async create(dto: UserAttributes): Promise<string> {

        // ✅ Проверяем уникальность логина и email одним запросом
        const uniqueUser = await this.usersRepository.findByLoginOrEmail(
            dto.login,
            dto.email
        );

        if (uniqueUser) {
            if (uniqueUser.login === dto.login) {
                throw new BadRequestException([
                    {
                        field: 'login',
                        message: 'login should be unique',
                    },
                ]);
            }
            if (uniqueUser.email === dto.email) {
                throw new BadRequestException([
                    {
                        field: 'email',
                        message: 'email should be unique',
                    },
                ]);
            }
        }

        // ✅ Хешируем пароль
        const hashedPassword = await argon2Service.generateHash(dto.password);


        //✅ создаем нового пользователя 
        const newUser: IUserDB = {
            login: dto.login,
            email: dto.email,
            password: hashedPassword, // ← сохраняем хеш!
            createdAt: new Date().toISOString(),


            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: new Date(Date.now() + 90 * 60 * 1000),
                isConfirmed: false
            }
        };

        return this.usersRepository.create(newUser);

    }

    //✅ Удалить пользователя 
    async delete(id: string): Promise<void> {
        await this.usersRepository.delete(id)
    }
}














