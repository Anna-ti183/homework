import request from 'supertest';
import { Express } from "express";
import { CommentOutput } from '../../../src/comments/output/comment.output';
import { COMMENTS_PATH } from '../../../src/comments/constants/comments.path';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { createComment } from '../posts/create-comment-id';

export async function getIdComment(
    app: Express,
    content: string,
    accessToken: string
): Promise<CommentOutput> {
    const comment = await createComment(app, content, accessToken)
    const commentId = comment.id



    const res = await request(app)
        .get(`${COMMENTS_PATH}/${commentId}`)
        .expect(HttpStatus.Ok);

    return res.body
}