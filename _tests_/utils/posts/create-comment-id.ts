import request from 'supertest';
import { Express } from "express";
import { CommentOutput } from '../../../src/comments/output/comment.output';
import { createPost } from './create-post';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { POSTS_PATH } from '../../../src/posts/constants/posts.path';


export async function createComment(
    app: Express,
    content: string,
    accessToken: string
): Promise<CommentOutput> {
    const post = await createPost(app);
    const postId = post.id;
    const res = await request(app)
        .post(`${POSTS_PATH}/${postId}/comments`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({content})
        .expect(HttpStatus.Created);

    return res.body;
  
}

