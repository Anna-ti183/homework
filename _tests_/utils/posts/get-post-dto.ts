import { PostAttributes } from "../../../src/posts/application/dtos/post-attributes";



export function getPostDto(blogId: string): PostAttributes {
    return {
        blogId,
        title: 'Test',
        shortDescription: 'Test shortDescription',
        content: 'Test content',

    };
}

