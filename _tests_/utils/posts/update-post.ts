import request from "supertest";
import { Express } from "express";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { POSTS_PATH } from "../../../src/posts/constants/posts.path";
import { getPostDto } from "./get-post-dto";
import { PostAttributes } from "../../../src/posts/application/dtos/post-attributes";

export async function updatePost(
  app: Express,
  postId: string,
  blogId: string,
  postDto?: PostAttributes,
): Promise<void> {


  const testPostData: PostAttributes =  { ...getPostDto(blogId), ...postDto };
 

  await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.NoContent);

  return;
}