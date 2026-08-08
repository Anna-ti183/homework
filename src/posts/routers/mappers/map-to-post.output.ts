//mapToPostData — преобразует пост из БД в формат PostDataOutput

import { WithId } from "mongodb";
import { Post } from "../../domain/posts";
import { PostOutput } from "../output/post.output";


////Это мапперы для преобразования поста из БД в формат ответа клиенту.
export function mapToPostData(post: WithId<Post>): PostOutput {
    return {
        id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,

    };
}
