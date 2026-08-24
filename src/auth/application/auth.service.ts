import { usersRepository } from "../../users/repositories/users.repository";
import { AuthAttributes } from "./dtos/auth.attributes";
import { argon2Service } from "../adapters/argon2.service";
import { jwtService } from "../adapters/jwt.service";


export const authService = {

    // 1. Ищем пользователя по логину ИЛИ email
    async loginUser(dto: AuthAttributes): Promise<string | null> {
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

        const accessToken = await jwtService.createToken(user._id.toString())

        return accessToken;
    }
}