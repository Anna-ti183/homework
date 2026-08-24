
import { postsQueryRepository } from "../../posts/repositories/posts.query-repositories";
import { usersQueryRepository } from "../../users/repositories/users.query-repository";
import { Comment } from "../domain/comment";
import { CommentDto } from "../input/comment.input.dto";
import { commentsQueryRepository } from "../repositories/comments.query-repositories";
import { commentsRepository } from "../repositories/comments.repositories";
import { ForbiddenException } from "../../core/exceptions/forbidden.exception";

export const commentsService = {
    async create(dto: CommentDto, userId:string, postId:string): Promise <string> {
        const post = await postsQueryRepository.findByIdOrFail(postId) //findByIdOrFail() сам выбросит ошибку на проверке если !post
      
        const user = await usersQueryRepository.findByOrFail(userId)//findByOrFail сам выбросит ошибку на проверке и в этой строке я уже получила userLogin

        const newComment: Comment = {
            content: dto.content,
            postId: postId,
            userId: userId,
            userLogin: user.login,
            createdAt: new Date().toISOString()
        };
        return commentsRepository.create(newComment)
    },

    async update(id:string, dto:CommentDto, userId: string): Promise <void> {

        const comment = await commentsQueryRepository.findByIdOrFail(id)

        if(comment.userId !== userId){
              throw new ForbiddenException('You can update only your own comment');
        }
        await commentsRepository.update(id, dto)
    },

    async delete(id: string, userId: string): Promise<void> {
        const comment = await commentsQueryRepository.findByIdOrFail(id);
       
        if(comment.userId !== userId){
            throw new ForbiddenException('You can delete only your own comment');
        }

        await commentsRepository.delete(id)
    },

}