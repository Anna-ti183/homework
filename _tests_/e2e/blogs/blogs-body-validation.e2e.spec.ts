import request from 'supertest';
import express from 'express';
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { setupApp } from '../../../src/setup-app';
import { clearDb } from '../../utils/clear-db';
import { BLOGS_PATH } from '../../../src/blogs/constant/blogs.paths';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/settings/config';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';





describe('Blog API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestBlogAttributes: BlogAttributes = getBlogDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });


  it(`❌ should not create blog when incorrect body passed; POST /api/blogs'`, async () => {

    // ✅ 1. Проверка 401 — без авторизации
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogAttributes)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
    
            name: '   ', //  ❌ empty string
            description: '    ', //  ❌ empty string
            websiteUrl: 'invalid websiteUrl', //  ❌ incorrect websiteUrl
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);


    const invalidDataSet2 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
            name: '', //❌ empty string
            description: '', // ❌ empty string
            websiteUrl: '', //❌ empty string
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);


    const invalidDataSet3 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
            name: 'Feodor',
            description: 'My life',
            websiteUrl: '', // ❌ empty string
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

    // check что никто не создался
    const blogListResponse = await request(app)
      .get(BLOGS_PATH)
      .set('Authorization', adminToken);
    expect(blogListResponse.body.items).toHaveLength(0);
  });



  it('❌ should not update blog when incorrect data passed; PUT /api/blogs/:id', async () => {
    const createdBlog = await createBlog(app, correctTestBlogAttributes);
    const createdBlogId = createdBlog.id;


    const invalidDataSet1 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
            name: '   ', //  ❌ empty string
            description: '    ', //  ❌ empty string
            websiteUrl: 'invalid websiteUrl', //  ❌ incorrect websiteUrl
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    const invalidDataSet2 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
            name: '', // ❌ empty string
            description: '', // ❌ empty string
            websiteUrl: '', //  ❌ empty string
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
            name: '', // ❌ empty string
            description: 'My test',
            websiteUrl: 'https://atest.com',
      })
      .expect(HttpStatus.BadRequest);


    expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

    // проверка что блог не изменился 
    const blogResponse = await getBlogById(app, createdBlog.id);

    expect(blogResponse).toEqual({
      ...createdBlog,
    });
  });

});



