import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { BlogAttributes } from "../../application/dtos/blog-attributes";


export async function updateBlogHandler(
    req: Request<{ id: string }, {}, BlogAttributes>,
    res: Response,
) {
    try {
        const id = req.params.id;
        const dto = req.body

        await blogsService.update(id, dto);

    res.sendStatus(HttpStatus.NoContent);

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}