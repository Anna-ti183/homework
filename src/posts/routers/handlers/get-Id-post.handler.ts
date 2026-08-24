import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsService } from "../../application/posts.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { mapToPostOutput, postsQueryRepository } from "../../../posts/repositories/posts.query-repositories"

export async function getIdPostHandler(
    req: Request<{ id: string }>,
    res: Response
) {
    try {
        const id = req.params.id //Берёт ID из URL

        const post = await postsQueryRepository.findByIdOrFail(id) //Ищет блог в БД

        const postOutput = mapToPostOutput(post); //Преобразует в формат для ответа

        res.status(HttpStatus.Ok).send(postOutput)

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
