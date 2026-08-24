import { Request, Response } from "express";
import { commentsQueryRepository, mapToCommentOutput } from "../../repositories/comments.query-repositories";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";

export async function getCommentHandler(
    req: Request<{ id:string }>,
    res: Response
){
    try{
        //Берём id из URL
        const id = req.params.id;

        //Ищем комментарий
        const comment = await commentsQueryRepository.findByIdOrFail(id);

        //Преобразуем MongoDB-документ в Swagger-формат:
        const commentOutput = mapToCommentOutput(comment);


        res.status(HttpStatus.Ok).send(commentOutput)

    } catch (e: unknown) {
            errorsHandler(e, res);
        }
}