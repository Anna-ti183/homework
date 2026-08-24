// BLL модуля постов. Подход обработки ошибок — throw + custom exceptions,
// которые на уровне хендлера ловит errorsHandler. Хендлеры остаются презентационным слоем.
import { Post } from '../domain/posts';
import { WithId } from 'mongodb';
import { postsRepository } from "../repositories/posts.repositories";
import { PostQueryInput } from "../routers/input/post-query.input";
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { PostAttributes } from './dtos/post-attributes';
import { blogsService } from '../../blogs/application/blogs.service';
import { postsQueryRepository } from '../repositories/posts.query-repositories';
import { blogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';


export const postsService = {

    //Создать новый пост (с blogName из блога)
    async create(dto: PostAttributes): Promise<string> {
        const blog = await blogsQueryRepository.findByIdOrFail(dto.blogId)
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