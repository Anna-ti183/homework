import { Request, Response } from "express";
import { UserAttributes } from "../../application/dtos/user-attributes";
import { usersService } from "../../application/users.service";
import { mapToUserOutput, usersQueryRepository } from "../../repositories/users.query-repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";

export async function createUserHandler(
    req: Request<{}, {}, UserAttributes>, ////  Дженерики -  P   ResBody ReqBody
    res: Response,
) {

    console.log('🔥🔥🔥 MY CREATE USER HANDLER 🔥🔥🔥');
    
    try {
        // 1. Создаем - (получаем ID)
        const createdUserId = await usersService.create(req.body);

         // 2. Находим по ID
        const createdUser = await usersQueryRepository.findById(createdUserId);

          // ✅ Проверяем, что пользователь найден
        if (!createdUser) {
            throw new Error('User not found after creation');
        }

        // 3. Маппим в формат для ответа клиенту
        const userOutput = mapToUserOutput(createdUser);

        // 4. Отдаем клиенту
        res.status(HttpStatus.Created).send(userOutput)


    } catch (e: unknown) {
        errorsHandler(e,res);
    }

}