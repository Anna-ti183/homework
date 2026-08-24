import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/settings/config";
import { clearDb } from "../../utils/clear-db";
import { createUser } from "../../utils/users/create-user";
import { loginUserAuth } from "../../utils/auth/create-login-auth";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createComment } from "../../utils/posts/create-comment-id";
import { COMMENTS_PATH } from "../../../src/comments/constants/comments.path";

describe('Post API body validation check', () => {
    const app = express();
    setupApp(app);

    let accessToken: string; //Создаём переменную, в которой будем хранить JWT. Она доступна всем тестам внутри describe.
    const content = 'This is a valid comment'; //создаем общую переменную  content чтобы не создавать ее в каждом нужном тесте 

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL);
        await clearDb(app);
        await createUser(app); //используем созданного юзера

        const res = await loginUserAuth(app); //Выполняем настоящий login через API и получаем ответ сервера.

        expect(res.status).toBe(HttpStatus.Ok); //Проверяем, что login действительно успешный — сервер вернул 200.

        accessToken = res.body.accessToken; // Достаём JWT из ответа и сохраняем его в нашу переменную accessToken
    });

    afterAll(async () => {
            await stopDb();
        });

    //✅ должен возвращать комментарий по существующему id
    it('✅ should return a comment by existing id; GET /api/comments/:id', async() => {
        const comment = await createComment(app, content, accessToken);
        const commentId = comment.id;

        await request(app)
        .get(`${COMMENTS_PATH}/${commentId}`)
        .expect(HttpStatus.Ok)
    });

    //должен удалить существующий комментарий
    it('✅ should delete an existing comment; DELETE /api/comments/:commentId', async() => {
        const comment = await createComment(app, content, accessToken);
        const commentId = comment.id;

        await request(app)
        .delete(`${COMMENTS_PATH}/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NoContent)
    });

    //должен обновить существующий комментарий
    it('✅ should update an existing comment; PUT /api/comments/:commentId', async() => {
        const comment = await createComment(app, content, accessToken);
        const commentId = comment.id;

        await request(app)
        .put(`${COMMENTS_PATH}/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({content: 'This content is being created for the update'})
        .expect(HttpStatus.NoContent)
    })

});