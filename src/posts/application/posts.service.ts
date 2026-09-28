// BLL модуля постов. Подход обработки ошибок — throw + custom exceptions,
// которые на уровне хендлера ловит errorsHandler. Хендлеры остаются презентационным слоем.
import { Post } from '../domain/posts';
import { PostsRepository } from "../repositories/posts.repositories";
import { PostAttributes } from './dtos/post-attributes';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { inject, injectable } from 'inversify';

@injectable()
export class PostsService {
    constructor(@inject(PostsRepository)protected postsRepository: PostsRepository,
                @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository ) { }
        //Создать новый пост (с blogName из блога)
    async create(dto: PostAttributes): Promise<string> {
        const blog = await this.blogsQueryRepository.findByIdOrFail(dto.blogId)
        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        };
        return this.postsRepository.create(newPost);
    }

    //Обновить пост
    async update(id: string, dto: PostAttributes): Promise<void> {
        await this.postsRepository.update(id, dto);
        return
    }

    //Удалить пост
    async delete(id: string): Promise<void> {
        await this.postsRepository.delete(id);
    }
}

