import request from 'supertest';
import { Express } from "express";
import { COMMENTS_PATH } from '../../../src/comments/constants/comments.path';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { createComment } from '../posts/create-comment-id';

export async function deleteComment(
    app: Express,
    content: string,
    accessToken: string
): Promise<void> {
    const comment = await createComment(app, content, accessToken);
    const commentId = comment.id

        await request(app)
            .delete(`${COMMENTS_PATH}/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatus.NoContent);
}
