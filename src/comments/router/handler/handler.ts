import { Request, Response } from "express";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { mapToCommentOutput } from "../../repositories/comments.query-repositories";
import { CommentDto } from "../../input/comment.input.dto";
import { CommentsService } from "../../application/comments.service";
import { CommentsQueryRepository } from "../../repositories/comments.query-repositories";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsController {
    constructor(@inject(CommentsService) protected commentsService: CommentsService,
                @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository) { }
                
    async getIdComment(req: Request<{ id: string }>, res: Response) {
        try {
            //Берём id из URL
            const id = req.params.id;

            //Ищем комментарий
            const comment = await this.commentsQueryRepository.findByIdOrFail(id);

            //Преобразуем MongoDB-документ в Swagger-формат:
            const commentOutput = mapToCommentOutput(comment);


            res.status(HttpStatus.Ok).send(commentOutput)

        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async deleteComment(req: Request<{ id: string }>, res: Response) {
        try {
            const id = req.params.id;
            const userId = req.userId!;
            await this.commentsService.delete(id, userId);

            res.status(HttpStatus.NoContent).send()

        } catch (e: unknown) {
            errorsHandler(e, res)
        }
    }

    async updateComment(req: Request<{ id: string }>, res: Response) {
        try {
            const id = req.params.id;

            const dto: CommentDto = {
                content: req.body.content,
            };

            const userId = req.userId!;

            await this.commentsService.update(id, dto, userId)

            res.sendStatus(HttpStatus.NoContent);

        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }
}