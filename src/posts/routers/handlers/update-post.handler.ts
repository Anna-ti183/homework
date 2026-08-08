import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsService } from "../../application/posts.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { PostAttributes } from "../../application/dtos/post-attributes";

export async function updatePostHandler(
    req: Request<{ id: string }, {}, PostAttributes>,
    res: Response,
) {
    try {
        const id = req.params.id;
        const dto = req.body

        await postsService.update(id, dto);

        res.sendStatus(HttpStatus.NoContent);

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}











