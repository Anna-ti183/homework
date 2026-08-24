import request, { Response } from 'supertest';
import { Express } from "express";
import { POSTS_PATH } from "../../../src/posts/constants/posts.path";
import { HttpStatus } from "../../../src/core/types/http-statuses";

export async function getComments(
    app: Express,
    id: string
): Promise<Response> {
   return await request(app) //request(app) — создаём HTTP-запрос к нашему Express-приложению app;
        .get(`${POSTS_PATH}/${id}/comments`)
        .expect(HttpStatus.Ok);
}
//«Отправь GET-запрос к этому endpoint, дождись ответа, проверь что статус 200, и верни весь HTTP-ответ».