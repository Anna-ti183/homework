import { WithId } from "mongodb";
import { Post } from "../../domain/posts"
import { PostOutput } from "../output/post.output";


// Используется для POST /posts (плоский ответ)
export function mapToPostOutput(post: WithId<Post>): PostOutput {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,  // ← берем из поста
        createdAt: post.createdAt,
    };
}

