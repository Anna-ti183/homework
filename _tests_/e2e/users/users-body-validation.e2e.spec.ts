import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { UserAttributes } from '../../../src/users/application/dtos/user-attributes';
import { getUserDto } from '../../utils/users/get-user';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { SETTINGS } from '../../../src/settings/config';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDb } from '../../utils/clear-db';
import { USERS_PATH } from '../../../src/users/constant/users.paths';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { createUser } from '../../utils/users/create-user';

describe('User API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestUserAttributes: UserAttributes = getUserDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it(`❌ should not create user when incorrect body passed; POST /api/users`, async () => {

        // ✅ 1. Проверка 401 — без авторизации
        await request(app)
          .post(USERS_PATH)
          .send(correctTestUserAttributes)
          .expect(HttpStatus.Unauthorized);


        const invalidDataSet1 = await request(app)
        .post(USERS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send({
            login: '     ' , //  ❌ empty string
            password: '     ' , //  ❌ empty string
            email: '     ' , //  ❌ empty string
        })
        .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

     const invalidDataSet2 = await request(app)
        .post(USERS_PATH)
        .set('Authorization', adminToken)
        .send({
            login: '' , //  ❌ empty string
            password: '' , //  ❌ empty string
            email: '' , //  ❌ empty string
        })
        .expect(HttpStatus.BadRequest);
    expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);

     const invalidDataSet3 = await request(app)
        .post(USERS_PATH)
        .set('Authorization', adminToken)
        .send({
            login: 'testing' , 
            password: 'testtest' , 
            email: '' , //  ❌ empty string
        })
        .expect(HttpStatus.BadRequest);
    expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

    // check что никто не создался
    const userListResponse = await request(app)
      .get(USERS_PATH)
      .set('Authorization', adminToken);
    expect(userListResponse.body.items).toHaveLength(0);
  });

})