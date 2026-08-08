import request from "supertest";
import { Express } from "express";
import { POSTS_PATH } from "../../../src/posts/constants/posts.path";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { PostOutput } from "../../../src/posts/routers/output/post.output";




export async function getPostById(
  app: Express, 
  id: string
):Promise<PostOutput> {
    const getResponse = await request(app)
        .get(`${POSTS_PATH}/${id}`)
        .expect(HttpStatus.Ok);

    return getResponse.body; 
}