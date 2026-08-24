import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { SETTINGS } from '../../../src/settings/config';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDb } from '../../utils/clear-db';
import { loginUserAuth } from '../../utils/auth/create-login-auth';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { AUTH_PATH } from '../../../src/auth/constant/auth.paths';

describe('Auth API body validation check', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('❌ should not login with incorrect input data; POST /api/auth/login', async () => {
     const invalidDataSet1 = await loginUserAuth(app, {
        loginOrEmail: '', //  ❌ empty string
        password: '', //  ❌ empty string
    });

    expect(invalidDataSet1.status).toBe(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorsMessages).toHaveLength(2);
  });

  it('❌ should not login with incorrect credentials; POST /api/auth/login', async () => {
    const invalidDataSet2 = await loginUserAuth(app, {
        loginOrEmail: 'wronguser',
        password: 'test123',
    });

    expect(invalidDataSet2.status).toBe(HttpStatus.Unauthorized);
  });


  it('❌ should not get current user without authorization; GET /api/auth/me', async () => {
    const res = await request(app) // создаём HTTP-запрос
    .get(`${AUTH_PATH}/me`) //делаем GET
    expect(res.status).toBe(HttpStatus.Unauthorized);
  })
  
})