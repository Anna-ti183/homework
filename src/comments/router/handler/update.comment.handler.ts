import { Request, Response } from "express";
import { CommentDto } from "../../input/comment.input.dto";
import { commentsService } from "../../application/comments.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";

export async function updateCommentHandler(
    req: Request<{ id: string }>,
    res: Response
) {
    try {
        const id = req.params.id;

        const dto: CommentDto = {
            content: req.body.content,
        };

        const userId = req.userId!;

        await commentsService.update(id, dto, userId)

        res.sendStatus(HttpStatus.NoContent);

    } catch (e: unknown) {
        errorsHandler(e, res);
    }

}