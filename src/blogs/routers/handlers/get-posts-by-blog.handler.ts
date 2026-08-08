// Обрабатывает GET-запрос на получение всех постов конкретного блога с пагинацией и сортировкой (GET /api/blogs/{blogId}/posts).
import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { postsService } from "../../../posts/application/posts.service";
import { mapToPostListPaginatedOutput } from "../../../posts/routers/mappers/map-post-input-dto-to-post.util";
import { PostQueryInput } from "../../../posts/routers/input/post-query.input";

export async function getPostsByBlogHandler(
    req: Request<{id: string},{}, {}, PostQueryInput>,
    res: Response
) {
   try {
        const blogId = req.params.id;

        // 1. Проверяем, существует ли блог
        await blogsService.findByIdOrFail(blogId);

        // 2. Берём query-параметры из запроса
        const queryInput = req.query;

        // 3. Вызываем сервис, получаем данные
        const { items, totalCount } = await postsService.findByBlogId(blogId, queryInput);

        // 4. Форматируем ответ с пагинацией
        const postsListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        // 5. Отправляем ответ
        res.status(HttpStatus.Ok).send(postsListOutput);  

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}