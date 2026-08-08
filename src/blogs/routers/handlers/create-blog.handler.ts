import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { BlogAttributes } from "../../application/dtos/blog-attributes";
import { mapToBlogOutput } from "../mappers/map-to-blog-output.util";

export async function createBlogHandler(
    req: Request<{}, {}, BlogAttributes>,
    res: Response,
) {

    try {
       
        // 1. Создаем блог (получаем ID)
        const createdBlogId = await blogsService.create(req.body)
        
        // 2. Находим созданный блог по ID
        const createdBlog = await blogsService.findByIdOrFail(createdBlogId);

        // 3. Маппим в формат для ответа клиенту
        const blogOutput = mapToBlogOutput(createdBlog);

        // 4. Отдаем клиенту
        res.status(HttpStatus.Created).send(blogOutput)

    } catch (e: unknown) {
        errorsHandler(e, res);

    }
}