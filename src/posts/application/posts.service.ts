// BLL модуля постов. Подход обработки ошибок — throw + custom exceptions,
// которые на уровне хендлера ловит errorsHandler. Хендлеры остаются презентационным слоем.
import { Post } from '../domain/posts';
import { WithId } from 'mongodb';
import { postsRepository } from "../repositories/posts.repositories";
import { PostQueryInput } from "../routers/input/post-query.input";
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { PostAttributes } from './dtos/post-attributes';
import { blogsService } from '../../blogs/application/blogs.service';


export const postsService = {
    //Получить список постов с пагинацией
    async findMany(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number}> {
        return postsRepository.findMany(queryDto);
    },

 //Для эндпоинта GET /api/blogs/{blogId}/posts - Получить посты конкретного блога с пагинацией
    async findByBlogId(
        blogId: string,
        queryDto: PostQueryInput
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        return postsRepository.findByBlogId(blogId,queryDto)
    },
//Найти пост по ID или выбросить ошибку
    async findByIdOrFail(id:string): Promise<WithId<Post>> {
       const res = await postsRepository.findById(id);
       if(res === null || !res){
        throw new NotFoundException('Post not found')
       }
       return res;
    },
    
    //Создать новый пост (с blogName из блога)
    async create(dto: PostAttributes): Promise<string> {
        const blog = await blogsService.findByIdOrFail(dto.blogId)
        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        };
        return postsRepository.create(newPost);
    },

    //Обновить пост
    async update(id: string, dto: PostAttributes): Promise<void> {
        await postsRepository.update(id, dto);
        return
    },

    //Удалить пост
    async delete(id: string): Promise<void> {
        await postsRepository.delete(id);
    },
}