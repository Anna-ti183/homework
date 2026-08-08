import request from "supertest";
import { Express } from "express";
import { getPostDto } from "./get-post-dto";
import { POSTS_PATH } from "../../../src/posts/constants/posts.path";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { PostAttributes } from "../../../src/posts/application/dtos/post-attributes";
import { createBlog } from "../blogs/create-blog";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { PostOutput } from "../../../src/posts/routers/output/post.output";




export async function createPost(
    app: Express,
    postDto?: PostAttributes,
): Promise<PostOutput> {

    const blog = await createBlog(app);
   
    const blogId = blog.id;
   


    const defaultPostData = getPostDto(blogId);
     
    // ✅ ПЛОСКАЯ СТРУКТУРА
    const testPostData = { ...defaultPostData, ...postDto };
        
    

    const createdPostResponse = await request(app)
        .post(POSTS_PATH)
        .set('Content-Type', 'application/json')
        .set('Authorization', generateBasicAuthToken())
        .send(testPostData)
        .expect(HttpStatus.Created);

    return createdPostResponse.body;
}