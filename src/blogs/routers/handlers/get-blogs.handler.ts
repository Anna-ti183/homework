import { Request, Response } from "express";
import { BlogQueryInput } from "../input/blog-query.input";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { mapToBlogListPaginatedOutput } from "../../repositories/blogs.query-repository";
import { blogsQueryRepository } from "../../repositories/blogs.query-repository";

export async function getBlogsHandler(
    req: Request<{}, {}, {}, BlogQueryInput>, // (Params) {}	Нет параметров в URL (нет /:id), ResBody	{}	Нет типизации для ответа, ReqBody	{}	Нет тела запроса (GET-запрос), ReqQuery	DriverQueryInput	Параметры запроса (query)
    res: Response,
) {
    try {
        // req.query уже провалидирован и приведён к типам middleware'ами
        // (paginationAndSorting + sanitizeQueryParams), поэтому используем его напрямую.
        // 1. Берём query-параметры из запроса
        const queryInput = req.query;

        // 2. Вызываем репозиторий, получаем данные
        const { items, totalCount } = await blogsQueryRepository.findMany(queryInput);

        // 3. Форматируем ответ с пагинацией
        const blogsListOutput = mapToBlogListPaginatedOutput(items, {  // Форматируем ответ в нужный пагинированный формат     //items — массив блогов (для текущей страницы)
            pageNumber: queryInput.pageNumber ,
            pageSize: queryInput.pageSize ,
            totalCount, //totalCount — общее количество блогов (без пагинации)
        });

        // 4. Отправляем ответ
        res.send(blogsListOutput);
    } catch 
        (e: unknown) {
            errorsHandler(e, res);
        }
}
