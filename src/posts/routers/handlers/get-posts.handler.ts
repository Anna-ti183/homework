import { Request, Response } from "express";
import { postsService } from "../../application/posts.service";
import { PostQueryInput } from "../input/post-query.input";
import { mapToPostListPaginatedOutput } from "../mappers/map-post-input-dto-to-post.util";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function getPostsHandler(
    req: Request<{},{},{}, PostQueryInput>,
    res: Response
) {
    try {

        // 1. Берём query-параметры из запроса
        const queryInput = req.query;

        // 2. Вызываем сервис, получаем данные
        const { items, totalCount } = await postsService.findMany(queryInput)

        // 3. Форматируем ответ с пагинацией
        const postsListOutput = mapToPostListPaginatedOutput(items, {
           pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount, //totalCount — общее количество блогов (без пагинации)
        })

        // 4. Отправляем ответ
        res.status(HttpStatus.Ok).send(postsListOutput)
} catch 
        (e: unknown) {
            errorsHandler(e, res);
        }
};


/*map() - это метод массивов в JavaScript, который:

Проходит по каждому элементу массива
Применяет функцию к каждому элементу
Возвращает НОВЫЙ массив с результатами 
*/