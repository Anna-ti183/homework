import { Request, Response } from "express";
import { commentsService } from "../../application/comments.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function deleteCommentHandler(
    req: Request <{ id: string}>,
    res: Response
){
    try{
        const id = req.params.id;
        const userId = req.userId!;
        await commentsService.delete(id,userId);

        res.status(HttpStatus.NoContent).send()
       
    } catch(e: unknown){
        errorsHandler (e, res)
    }
}