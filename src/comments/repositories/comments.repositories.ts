import { ObjectId, WithId } from "mongodb";
import { Comment } from "../domain/comment";
import { commentCollection } from "../../db/collections";
import { NotFoundException } from "../../core/exceptions/not-found.exception";
import { CommentDto } from "../input/comment.input.dto";

export const commentsRepository = {
    //Найти пост по ID
    async findById(id:string): Promise<WithId<Comment> | null> {
        return commentCollection.findOne({_id: new ObjectId(id) })
    },

    //Сщздать комментарий
    async create(newComment: Comment): Promise<string> {
        const result = await commentCollection.insertOne(newComment);
        return result.insertedId.toString()
    },

    async update(id: string, dto: CommentDto): Promise <void>{
        const updateResult = await commentCollection.updateOne(
            {_id: new ObjectId(id)}, 
            {$set: {content: dto.content}}
        );
        if(updateResult.matchedCount < 1) {
            throw new NotFoundException('Comment not exist')
        }
        return;
    },



    async delete(id: string): Promise <void> {
        const deleteResult = await commentCollection.deleteOne({ _id: new ObjectId(id)});
        if(deleteResult.deletedCount < 1) {
        throw new NotFoundException('Comment not exist');
        }

        return;
    }


}