import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";

import { postsService } from "../../application/posts.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { mapToPostOutput  } from "../mappers/map-to-post-post.util";
import { PostAttributes } from "../../application/dtos/post-attributes";

export async function createPostHandler(
    req: Request<{}, {}, PostAttributes>,
    res: Response,
) {
    try {
        // 1. Создаем пост (получаем ID)
        const createdPostId = await postsService.create(req.body)

        // 2. Находим созданный блог по ID
        const createdPost = await postsService.findByIdOrFail(createdPostId);

        // 3. Маппим в формат для ответа клиенту
        const postOutput = mapToPostOutput(createdPost);

        // 4. Отдаем клиенту
        res.status(HttpStatus.Created).send(postOutput)

    } catch (e: unknown) {
        errorsHandler(e, res);

    }
}



