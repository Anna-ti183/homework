import { WithId } from "mongodb";
import { Blog } from "../../domain/blogs";
import { BlogOutput } from "../../output/blog.output";


// Используется для POST /blogs (плоский ответ)
export function mapToBlogOutput(blog: WithId<Blog>): BlogOutput {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    };
}