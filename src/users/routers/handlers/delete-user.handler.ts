import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { usersService } from "../../application/users.service";


export async function deleteUserHandler(
    req: Request<{id: string}>,
    res: Response
) {
    try{
        // 1. Получаем ID из параметров URL
        const id = req.params.id;

        // 2. Вызываем сервис для удаления
        await usersService.delete(id);

        // 3. Возвращаем 204 No Content (успешно, ничего не возвращаем)
        res.sendStatus(HttpStatus.NoContent);

    } catch (e: unknown){
        // 4. Любую ошибку передаем в централизованный обработчик
        errorsHandler(e, res);
    }
}