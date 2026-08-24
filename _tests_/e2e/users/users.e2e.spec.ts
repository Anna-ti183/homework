import request from "supertest";
import express from "express";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { SETTINGS } from "../../../src/settings/config";
import { setupApp } from "../../../src/setup-app";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/clear-db";
import { createUser } from "../../utils/users/create-user";
import { getUserDto } from "../../utils/users/get-user";
import { USERS_PATH } from "../../../src/users/constant/users.paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";


describe('User API', () => {
    const app = express();
    setupApp(app);

    const adminToken = generateBasicAuthToken();

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL);
        await clearDb(app);

        await createUser(app, {
            login: 'Dimych',
            password: 'test123',
            email: 'dimych@gmail.com',
        });

        await createUser(app, {
            login: 'Natalia',
            password: 'test123',
            email: 'kuzyuberdina@gmail.com',
        });
    });

    // Закрываем соединение с БД, чтобы процесс тестов корректно завершался.
    afterAll(async () => {
        await stopDb();
    });



    it('✅ should create user; POST /api/users', async () => {
        await createUser(app, { //вызывается результат асинхронной функции из utils
            ...getUserDto(), //возвращает твои стандартные тестовые данные:
            login: 'testuser',
            password: 'test123',
            email: 'test@test.dev'
        });
    });

    it('✅ should return users list; GET /api/users', async () => {
        await Promise.all([ //Запускаем несколько асинхронных операций одновременно и ждём, пока обе закончатся.
            createUser(app, { //Создаём первого пользователя.
                login: 'userone',
                password: 'test111',
                email: 'userone@test.dev',
            }),
            createUser(app, { //Создаём второго пользователя.
                login: 'usertwo',
                password: 'test222',
                email: 'usertwo@test.dev',
            }),
        ]);
        //«Перед проверкой списка создаём двух пользователей и ждём, пока оба реально создадутся».
        const res = await request(app)
            .get(USERS_PATH) //проверяем, что GET возвращает этих пользователей.
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(res.body.items).toBeInstanceOf(Array); //👉 Проверяем, что items — это массив.
        expect(res.body.items.length).toBeGreaterThanOrEqual(2); //👉 Проверяем, что в этом массиве минимум 2 пользователя.

    });

    it('✅ should delete user and check after "NOT FOUND"; DELETE /api/users/:id', async () => {
        const createdUser = await createUser(app, {
            login: 'usertw3',
            password: 'test333',
            email: 'usertwo@test.do',
        });

        await request(app)
            .delete(`${USERS_PATH}/${createdUser.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);

        const res = await request(app)
            .get(USERS_PATH)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(res.body.items).toBeInstanceOf(Array);


        const deletedUser = res.body.items.find( //«Найди в этом массиве пользователя, у которого id совпадает с id удалённого пользователя».
            (user: any) => user.id === createdUser.id, //«Берём каждого пользователя из массива и сравниваем его id с createdUser.id».
        );

        expect(deletedUser).toBeUndefined(); //Если такого пользователя нет, find() вернёт:deletedUser = undefined 
    });

})