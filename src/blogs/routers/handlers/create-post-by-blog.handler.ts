//Обрабатывает POST-запрос на создание поста в конкретном блоге (POST /api/blogs/{blogId}/posts).

import { Request, Response } from "express";
import { BlogPostInputDto } from "../../dto/blogs-post-input-dto";
import { blogsService } from "../../application/blogs.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { postsService } from "../../../posts/application/posts.service";
import { mapToPostOutput } from "../../../posts/routers/mappers/map-to-post-post.util";


export async function createPostByBlogHandler(
    req: Request <{id: string}, {}, BlogPostInputDto>,
    res: Response,
) {
    try{
        const blogId = req.params.id;
        const { title, shortDescription, content } = req.body;

    // 1. Проверяем, существует ли блог
        await blogsService.findByIdOrFail(blogId);

        // 2. Создаём пост
        const createdPostId = await postsService.create({
            blogId,
            title,
            shortDescription,
            content,
        });

        // 3. Получаем созданный пост со всеми данными
        const createdPost = await postsService.findByIdOrFail(createdPostId);

        // 4. Маппим в нужный формат
        const postOutput = mapToPostOutput(createdPost);

        // 5. Возвращаем 201
        res.status(HttpStatus.Created).send(postOutput);

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}

