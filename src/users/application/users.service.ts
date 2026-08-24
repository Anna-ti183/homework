import { User } from "../domain/users";
import { usersRepository } from "../repositories/users.repository";
import { UserAttributes } from "./dtos/user-attributes";
import argon2 from "argon2";
import { BadRequestException } from "../../core/exceptions/bad-request.exception";
import { argon2Service } from "../../auth/adapters/argon2.service";

export const usersService = {

    //Создать нового юзера
    async create(dto: UserAttributes): Promise<string> {

        // ✅ Проверяем уникальность логина и email одним запросом
        const uniqueUser = await usersRepository.findByLoginOrEmail(
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
        const newUser: User = {
            login: dto.login,
            email: dto.email,
            password: hashedPassword, // ← сохраняем хеш!
            createdAt: new Date().toISOString(),
        };

        return usersRepository.create(newUser);

    },

    //✅ Удалить пользователя 
    async delete(id: string): Promise<void> {
        await usersRepository.delete(id)
    },

};













