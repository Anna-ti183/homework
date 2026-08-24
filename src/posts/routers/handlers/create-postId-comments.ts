import { Request, Response } from "express";
import { commentsService } from "../../../comments/application/comments.service";
import { CommentDto } from "../../../comments/input/comment.input.dto";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { commentsQueryRepository, mapToCommentOutput } from "../../../comments/repositories/comments.query-repositories";

export async function createCommentHandler(
    req: Request<{ postId: string }>,
    res: Response,
) {
    try {
        // 1. Берём postId из URL
        const postId = req.params.postId;

        // 2. Берём content из body
        const dto: CommentDto = {
            content: req.body.content,
        };

        // 3. Берём userId из JWT
        const userId = req.userId;

        // 4. Создаём комментарий
        const commentId = await commentsService.create(
            dto,
            userId!,
            postId,
        );

        // 5. Находим созданный комментарий
        const comment = await commentsQueryRepository.findByIdOrFail(commentId);

        // 6. Преобразуем в формат ответа
        const commentOutput = mapToCommentOutput(comment);

        // 7. Возвращаем 201
        res.status(HttpStatus.Created).send(commentOutput);

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}