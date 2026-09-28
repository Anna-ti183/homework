
import { PostsQueryRepository} from "../../posts/repositories/posts.query-repositories";
import { UsersQueryRepository } from "../../users/repositories/users.query-repository";
import { Comment } from "../domain/comment";
import { CommentDto } from "../input/comment.input.dto";
import { CommentsQueryRepository } from "../repositories/comments.query-repositories";
import { CommentsRepository } from "../repositories/comments.repositories";
import { ForbiddenException } from "../../core/exceptions/forbidden.exception";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsService {
    constructor(@inject(CommentsRepository) protected commentsRepository: CommentsRepository,
                @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository){}

    async create(dto: CommentDto, userId:string, postId:string): Promise <string> {
        const post = await this.postsQueryRepository.findByIdOrFail(postId) //findByIdOrFail() сам выбросит ошибку на проверке если !post
      
        const user = await this.usersQueryRepository.findByOrFail(userId)//findByOrFail сам выбросит ошибку на проверке и в этой строке я уже получила userLogin

        const newComment: Comment = {
            content: dto.content,
            postId: postId,
            userId: userId,
            userLogin: user.login,
            createdAt: new Date().toISOString()
        };
        return this.commentsRepository.create(newComment)
    }

    async update(id:string, dto:CommentDto, userId: string): Promise <void> {

        const comment = await this.commentsQueryRepository.findByIdOrFail(id)

        if(comment.userId !== userId){
              throw new ForbiddenException('You can update only your own comment');
        }
        await this.commentsRepository.update(id, dto)
    }

    async delete(id: string, userId: string): Promise<void> {
        const comment = await this.commentsQueryRepository.findByIdOrFail(id);
       
        if(comment.userId !== userId){
            throw new ForbiddenException('You can delete only your own comment');
        }

        await this.commentsRepository.delete(id)
    }
}
