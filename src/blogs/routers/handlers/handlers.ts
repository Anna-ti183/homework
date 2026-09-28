import { Request, Response } from "express";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { BlogsQueryRepository, mapToBlogListPaginatedOutput, mapToBlogOutput } from "../../repositories/blogs.query-repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { mapToPostListPaginatedOutput, mapToPostOutput, PostsQueryRepository  } from "../../../posts/repositories/posts.query-repositories";
import { BlogQueryInput } from "../input/blog-query.input";
import { PostQueryInput } from "../../../posts/routers/input/post-query.input";
import { BlogAttributes } from "../../application/dtos/blog-attributes";
import { BlogPostInputDto } from "../../dto/blogs-post-input-dto";
import { BlogsService } from "../../application/blogs.service";
import { PostsService } from "../../../posts/application/posts.service";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsController {
    constructor(@inject(BlogsService) protected blogsService: BlogsService,
                @inject(PostsService) protected postsService: PostsService,
                @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
                @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository){}

    async createBlog(req: Request<{}, {}, BlogAttributes>, res: Response) {

        try {

            // 1. Создаем блог (получаем ID)
            const createdBlogId = await this.blogsService.create(req.body)

            // 2. Находим созданный блог по ID
            const createdBlog = await this.blogsQueryRepository.findById(createdBlogId);

            // ✅ Проверяем, что блог найден
            if (!createdBlog) {
                throw new Error('Blog not found after creation');
            }

            // 3. Маппим в формат для ответа клиенту
            const blogOutput = mapToBlogOutput(createdBlog);

            // 4. Отдаем клиенту
            res.status(HttpStatus.Created).send(blogOutput)

        } catch (e: unknown) {
            errorsHandler(e, res);

        }

    }

    async createPostByBlog(req: Request<{ id: string }, {}, BlogPostInputDto>, res: Response) {

        try {
            const blogId = req.params.id;
            const { title, shortDescription, content } = req.body;

            // 1. Проверяем, существует ли блог
            await this.blogsQueryRepository.findByIdOrFail(blogId);

            // 2. Создаём пост
            const createdPostId = await this.postsService.create({
                blogId,
                title,
                shortDescription,
                content,
            });

            // 3. Получаем созданный пост со всеми данными
            const createdPost = await this.postsQueryRepository.findByIdOrFail(createdPostId);

            // 4. Маппим в нужный формат
            const postOutput = mapToPostOutput(createdPost);

            // 5. Возвращаем 201
            res.status(HttpStatus.Created).send(postOutput);

        } catch (e: unknown) {
            errorsHandler(e, res);
        }

    }

    async deleteBlog(req: Request<{ id: string }>, res: Response) {
        try {
            // 1. Получаем ID из параметров URL
            const id = req.params.id;

            // 2. Вызываем сервис для удаления
            await this.blogsService.delete(id);

            // 3. Возвращаем 204 No Content (успешно, ничего не возвращаем)
            res.sendStatus(HttpStatus.NoContent);

        } catch (e: unknown) {

            // 4. Любую ошибку передаем в централизованный обработчик
            errorsHandler(e, res);
        }

    }

    async getBlogs(req: Request, res: Response) {
        try {
            // req.query уже провалидирован и приведён к типам middleware'ами
            // (paginationAndSorting + sanitizeQueryParams), поэтому используем его напрямую.
            // 1. Берём query-параметры из запроса
            const queryInput = req.query as unknown as BlogQueryInput

            // 2. Вызываем репозиторий, получаем данные
            const { items, totalCount } = await this.blogsQueryRepository.findMany(queryInput);

            // 3. Форматируем ответ с пагинацией
            const blogsListOutput = mapToBlogListPaginatedOutput(items, {  // Форматируем ответ в нужный пагинированный формат     //items — массив блогов (для текущей страницы)
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount, //totalCount — общее количество блогов (без пагинации)
            });

            // 4. Отправляем ответ
            res.send(blogsListOutput);
        } catch
        (e: unknown) {
            errorsHandler(e, res);
        }

    }

    async getIdBlog( req: Request<{ id: string }>, res: Response){
       try {
               const id = req.params.id //Берёт ID из URL
       
               const blog = await this.blogsQueryRepository.findByIdOrFail(id); //Ищет блог в БД
       
            
               const blogOutput = mapToBlogOutput(blog); //Преобразует в формат для ответа
               
               res.status(HttpStatus.Ok).send(blogOutput)
       
            } catch (e: unknown) {
           errorsHandler(e, res);
         } 
    }

    async getPostByBlog(req: Request<{id: string}>, res: Response){
        try {
                const blogId = req.params.id;
        
                // 1. Проверяем, существует ли блог
                await this.blogsQueryRepository.findByIdOrFail(blogId);
        
                // 2. Берём query-параметры из запроса
                const queryInput = req.query as unknown as PostQueryInput
        
                // 3. Вызываем сервис, получаем данные
                const { items, totalCount } = await this.postsQueryRepository.findByBlogId(blogId, queryInput);
        
                // 4. Форматируем ответ с пагинацией
                const postsListOutput = mapToPostListPaginatedOutput(items, {
                    pageNumber: queryInput.pageNumber,
                    pageSize: queryInput.pageSize,
                    totalCount,
                });
        
                // 5. Отправляем ответ
                res.status(HttpStatus.Ok).send(postsListOutput);  
        
            } catch (e: unknown) {
                errorsHandler(e, res);
            }
    }

    async updateBlog(req: Request<{ id: string }, {}, BlogAttributes>, res: Response){
        try {
                const id = req.params.id;
                const dto = req.body
        
                await this.blogsService.update(id, dto);
        
            res.sendStatus(HttpStatus.NoContent);
        
            } catch (e: unknown) {
                errorsHandler(e, res);
            }
    }
}

