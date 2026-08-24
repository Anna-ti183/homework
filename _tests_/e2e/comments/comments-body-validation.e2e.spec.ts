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

    //не должен возвращать комментарий, если комментарий с указанным id не существует
    it('❌ should not return a comment if the specified id does not exist; GET /api/comments/:id', async () => {

        await request(app)
            .get(`${COMMENTS_PATH}/66c9ff8a3d4f12a3b4c5e6a5`)
            .expect(HttpStatus.NotFound)
    });

    //не должен удалять комментарий без авторизации
    it('❌ should not delete a comment without authorization; DELETE /api/comments/:commentId', async () => {
        const comment = await createComment(app, content, accessToken);
        const commentId = comment.id;

        await request(app)
            .delete(`${COMMENTS_PATH}/${commentId}`)
            .expect(HttpStatus.Unauthorized)
    });

    //не должен удалять комментарий, если он не принадлежит текущему пользователю
    it('❌ should not delete a comment if it does not belong to the current user; DELETE /api/comments/:commentId', async () => {

        const user1 = await createUser(app, { //создаем 1-го пользователя 
            login: 'user1',
            password: 'test123',
            email: 'user1@test.dev'
        });
        const res1 = await loginUserAuth(app, { // передаем в переменную новые данные (логин и пороль) 
            loginOrEmail: 'user1',
            password: 'test123'
        });
        const accessToken1 = res1.body.accessToken; // получаем токен 

        const user2 = await createUser(app, {
            login: 'user2',
            password: 'test123',
            email: 'user2@test.dev'
        });
        const res2 = await loginUserAuth(app, {
            loginOrEmail: 'user2',
            password: 'test123'
        });
        const accessToken2 = res2.body.accessToken;

        const comment = await createComment(app, content, accessToken1); // 1 польз-ль создает коммент
        const commentId = comment.id;

        await request(app)
            .delete(`${COMMENTS_PATH}/${commentId}`)
            .set('Authorization', `Bearer ${accessToken2}`) // 2 польз-ль удаляет коммент
            .expect(HttpStatus.Forbidden) // ошибка 403
    });

    //не должен удалять комментарий, если комментарий с указанным id не существует
    it('❌ should not delete a comment if the specified id does not exist; DELETE /api/comments/:commentId', async () => {
        await request(app)
            .delete(`${COMMENTS_PATH}/66c9ff8a3d4f12a3b4c5e6a5`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatus.NotFound)
    });

    //не должен обновлять комментарий, если переданы некорректные данные
    it('❌should not update a comment if incorrect data is passed; PUT /api/comments/:commentId', async () => {
        const comment = await createComment(app, content, accessToken);
        const commentId = comment.id;

        await request(app)
            .put(`${COMMENTS_PATH}/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: 'I like test' })
            .expect(HttpStatus.BadRequest)
    });

    //не должен обновлять комментарий без авторизации
    it('❌ should not update a comment without authorization; PUT /api/comments/:commentId', async () => {
        const comment = await createComment(app, content, accessToken);
        const commentId = comment.id;

        await request(app)
            .put(`${COMMENTS_PATH}/${commentId}`)
            .send({ content: 'This content is being created for the update' })
            .expect(HttpStatus.Unauthorized)
    });

    //не должен обновлять комментарий, если он не принадлежит текущему пользователю
    it('❌ should not update a comment if it does not belong to the current user', async () => {
        const user3 = await createUser(app, { //создаем 1-го пользователя 
            login: 'user3',
            password: 'test1233',
            email: 'user3@test.dev'
        });
        const res3 = await loginUserAuth(app, { // передаем в переменную новые данные (логин и пороль) 
            loginOrEmail: 'user3',
            password: 'test1233'
        })
        const accessToken3 = res3.body.accessToken; // получаем токен 

        const user4 = await createUser(app, {
            login: 'user4',
            password: 'test1234',
            email: 'user4@test.dev'
        });
        const res4 = await loginUserAuth(app, {
            loginOrEmail: 'user4',
            password: 'test1234'
        });
        const accessToken4 = res4.body.accessToken;

        const comment = await createComment(app, content, accessToken3); // 1 польз-ль создает коммент
        const commentId = comment.id;

        await request(app)
            .put(`${COMMENTS_PATH}/${commentId}`)
            .set('Authorization', `Bearer ${accessToken4}`)
            .send({content: 'This content is being created for the update'}) // 2 польз-ль обновляет коммент
            .expect(HttpStatus.Forbidden) // ошибка 403
    });

    //не должен обновлять комментарий, если комментарий с указанным id не существует
    it('❌ should not update a comment if the specified id does not exist; PUT /api/comments/:commentId', async() => {
        await request(app)
        .put(`${COMMENTS_PATH}/66c9ff8a3d4f12a3b4c5e6a5`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({content})
        .expect(HttpStatus.NotFound)
    })
});