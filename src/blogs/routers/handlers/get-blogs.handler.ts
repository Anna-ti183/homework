import { Request, Response } from "express";
import { BlogQueryInput } from "../input/blog-query.input";
import { blogsService } from "../../application/blogs.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { mapToBlogListPaginatedOutput } from "../mappers/map-blog-input-dto-to-blog.util";

export async function getBlogsHandler(
    req: Request<{}, {}, {}, BlogQueryInput>, // (Params) {}	Нет параметров в URL (нет /:id), ResBody	{}	Нет типизации для ответа, ReqBody	{}	Нет тела запроса (GET-запрос), ReqQuery	DriverQueryInput	Параметры запроса (query)
    res: Response,
) {
    try {
        // req.query уже провалидирован и приведён к типам middleware'ами
        // (paginationAndSorting + sanitizeQueryParams), поэтому используем его напрямую.
        // 1. Берём query-параметры из запроса
        const queryInput = req.query;

        // 2. Вызываем сервис, получаем данные
        const { items, totalCount } = await blogsService.findMany(queryInput);

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
