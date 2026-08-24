import { Request, Response } from "express";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { mapToUserListPaginatedOutput, usersQueryRepository } from "../../repositories/users.query-repository";
import { UserQueryInput } from "../input/user-query.input";

export async function getUserHandler(
    req: Request<{}, {}, {}, UserQueryInput>,
    res: Response,
) {
    try {

        console.log('RAW QUERY:', req.query);
        // 1. Берём query-параметры из запроса
        const queryInput = req.query;

        // 2. Вызываем сервис, получаем данные
        const { items, totalCount } = await usersQueryRepository.findMany(queryInput);

        // 3. Форматируем ответ с пагинацией
        const usersListOutput = mapToUserListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount, //totalCount — общее количество блогов (без пагинации)
        });

        // 4. Отправляем ответ
        res.send(usersListOutput);

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
