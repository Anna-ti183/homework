import request from 'supertest';
import { Express } from "express";
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { createComment } from '../posts/create-comment-id';
import { COMMENTS_PATH } from '../../../src/comments/constants/comments.path';

export async function updateComment(
    app: Express,
    content: string,
    accessToken: string
): Promise<void> {
    const comment = await createComment(app, content, accessToken); // создаем комментарий
    const commentId = comment.id; // получаем его ID
    await request(app)
        .put(`${COMMENTS_PATH}/${commentId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content })
        .expect(HttpStatus.NoContent);
}