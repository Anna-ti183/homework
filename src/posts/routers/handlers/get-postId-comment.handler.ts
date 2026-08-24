import { commentsQueryRepository, mapToCommentListPaginatedOutput} from "../../../comments/repositories/comments.query-repositories";
import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { CommentQueryInput } from "../../../comments/router/input/comment.query.input";
import { postsQueryRepository } from "../../repositories/posts.query-repositories";

export async function getPostIdCommentHandler(
    req: Request<{ postId: string }>,
    res: Response
) {
    try {
        

        const postId = req.params.postId;
        
        const post = await postsQueryRepository.findByIdOrFail(postId)

        const queryInput = req.query as unknown as CommentQueryInput;

        const { items, totalCount } = await commentsQueryRepository.findMany(queryInput, postId);

        // 3. Форматируем ответ с пагинацией
        const commentsListOutput = mapToCommentListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount, //totalCount — общее количество блогов (без пагинации)
        })

        // 4. Отправляем ответ
        res.status(HttpStatus.Ok).send(commentsListOutput)
        
    } catch
    (e: unknown) {
        errorsHandler(e, res);
    }
}














