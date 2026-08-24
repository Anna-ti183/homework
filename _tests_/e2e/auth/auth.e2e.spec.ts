import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { SETTINGS } from "../../../src/settings/config";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/clear-db";
import { loginUserAuth } from "../../utils/auth/create-login-auth";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createUser } from "../../utils/users/create-user";
import { AUTH_PATH } from "../../../src/auth/constant/auth.paths";


describe('Auth API', () => {
    const app = express();
    setupApp(app);

    let accessToken: string; //Создаём переменную, в которой будем хранить JWT. Она доступна всем тестам внутри describe.


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

    it('✅ should login user; POST /api/auth/login', async () => {
        const res = await loginUserAuth(app);

        expect(res.status).toBe(HttpStatus.Ok);
    });

    it('✅ should get current user; GET /api/auth/me', async () => {
        const res = await request(app) // создаём HTTP-запрос
    .get(`${AUTH_PATH}/me`)
    .set('Authorization', `Bearer ${accessToken}`)

     expect(res.status).toBe(HttpStatus.Ok);
    });
})