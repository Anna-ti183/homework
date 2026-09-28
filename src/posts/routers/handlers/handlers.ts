import { Request, Response } from "express";
import { PostAttributes } from "../../application/dtos/post-attributes";
import { mapToPostListPaginatedOutput, mapToPostOutput } from "../../repositories/posts.query-repositories";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { CommentDto } from "../../../comments/input/comment.input.dto";
import { CommentsQueryRepository, mapToCommentListPaginatedOutput, mapToCommentOutput } from "../../../comments/repositories/comments.query-repositories";
import { CommentQueryInput } from "../../../comments/router/input/comment.query.input";
import { PostQueryInput } from "../input/post-query.input";
import { PostsService } from "../../application/posts.service";
import { CommentsService } from "../../../comments/application/comments.service";
import { PostsQueryRepository } from "../../repositories/posts.query-repositories";
import { inject, injectable } from "inversify";

@injectable()
export class PostsController {
        constructor(@inject(PostsService) protected postsService: PostsService,
                    @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                    @inject(CommentsService) protected commentsService: CommentsService,
                    @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository
        ){}

    async createPost(req: Request<{}, {}, PostAttributes>, res: Response) {
        try {
            // 1. Создаем пост (получаем ID)
            const createdPostId = await this.postsService.create(req.body)

            // 2. Находим созданный блог по ID
            const createdPost = await this.postsQueryRepository.findByIdOrFail(createdPostId);

            // 3. Маппим в формат для ответа клиенту
            const postOutput = mapToPostOutput(createdPost);

            // 4. Отдаем клиенту
            res.status(HttpStatus.Created).send(postOutput)

        } catch (e: unknown) {
            errorsHandler(e, res);

        }
    }


    async createPostIdComment(req: Request<{ postId: string }>, res: Response) {
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
            const commentId = await this.commentsService.create(
                dto,
                userId!,
                postId,
            );

            // 5. Находим созданный комментарий
            const comment = await this.commentsQueryRepository.findByIdOrFail(commentId);

            // 6. Преобразуем в формат ответа
            const commentOutput = mapToCommentOutput(comment);

            // 7. Возвращаем 201
            res.status(HttpStatus.Created).send(commentOutput);

        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }


    async deletePost(req: Request<{ id: string }>, res: Response) {
        try {
            const id = req.params.id;

            await this.postsService.delete(id);

            res.sendStatus(HttpStatus.NoContent);

        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }


    async getIdPost(req: Request<{ id: string }>, res: Response) {
        try {
            const id = req.params.id //Берёт ID из URL

            const post = await this.postsQueryRepository.findByIdOrFail(id) //Ищет блог в БД

            const postOutput = mapToPostOutput(post); //Преобразует в формат для ответа

            res.status(HttpStatus.Ok).send(postOutput)

        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }


    async getPostIdComment(req: Request<{ postId: string }>, res: Response) {
        try {


            const postId = req.params.postId;

            const post = await this.postsQueryRepository.findByIdOrFail(postId)

            const queryInput = req.query as unknown as CommentQueryInput;

            const { items, totalCount } = await this.commentsQueryRepository.findMany(queryInput, postId);

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


    async getPosts(req: Request, res: Response) {
        try {
            // 1. Берём query-параметры из запроса
            const queryInput = req.query as unknown as PostQueryInput;

            // 2. Вызываем сервис, получаем данные
            const { items, totalCount } = await this.postsQueryRepository.findMany(queryInput)

            // 3. Форматируем ответ с пагинацией
            const postsListOutput = mapToPostListPaginatedOutput(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount, //totalCount — общее количество блогов (без пагинации)
            })

            // 4. Отправляем ответ
            res.status(HttpStatus.Ok).send(postsListOutput)
        } catch
        (e: unknown) {
            errorsHandler(e, res);
        }
    }


    async updatePost(req: Request<{ id: string }, {}, PostAttributes>, res: Response) {
        try {
            const id = req.params.id;
            const dto = req.body

            await this.postsService.update(id, dto);

            res.sendStatus(HttpStatus.NoContent);

        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }
}







