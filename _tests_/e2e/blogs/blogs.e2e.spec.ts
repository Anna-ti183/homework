
import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import { getBlogById } from "../../utils/blogs/get-blog-by-id";
import { updateBlog } from "../../utils/blogs/update-blog";
import { BLOGS_PATH } from "../../../src/blogs/constant/blogs.paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { SETTINGS } from "../../../src/settings/config";
import { runDB, stopDb } from "../../../src/db/mongo.db"
import { createBlog } from "../../utils/blogs/create-blog";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blog-attributes";


describe('Blog API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  // Закрываем соединение с БД, чтобы процесс тестов корректно завершался.
  afterAll(async () => {
    await stopDb();
  });

  it('✅ should create blog; POST /api/blogs', async () => {
    await createBlog(app, {
      ...getBlogDto(),
      name: 'Feodor test',
      description: 'My Feodor test',
    });
  });


    it('✅ should return blogs list; GET /api/blogs', async () => {
      await Promise.all([createBlog(app), createBlog(app)]);


      const response = await request(app)
        .get(BLOGS_PATH)
        .expect(HttpStatus.Ok);

      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    });


    it('✅ should return blog by id; GET /api/blogs/:id', async () => {
      const createdBlog = await createBlog(app);
      const createdBlogId = createdBlog.id;

      const blog = await getBlogById(app, createdBlogId);

      expect(blog).toEqual({
        ...createdBlog,
        id: expect.any(String),
        createdAt: expect.any(String),
      });
    });

    it('✅ should update blog; PUT /api/blogs/:id', async () => {
      const createdBlog = await createBlog(app);

      const blogUpdateData: BlogAttributes = {
        name: 'Updated test',
        description: 'My name test',
        websiteUrl: 'https://nametest.com',

      };

      await updateBlog(app, createdBlog.id, blogUpdateData);

      const blogResponse = await getBlogById(app, createdBlog.id);

      expect(blogResponse).toEqual({
        name: blogUpdateData.name,
        description: blogUpdateData.description,
        websiteUrl: blogUpdateData.websiteUrl,
        isMembership: false,
        createdAt: expect.any(String),
        id: expect.any(String),
      },


      );
    });

    it('✅ should delete blog and check after "NOT FOUND"; DELETE /api/blogs/:id', async () => {
      const createdBlog = await createBlog(app);

      await request(app)
        .delete(`${BLOGS_PATH}/${createdBlog.id}`)
        .set('Authorization', adminToken)
        .expect(HttpStatus.NoContent);

      await request(app)
        .get(`${BLOGS_PATH}/${createdBlog.id}`)
        .set('Authorization', adminToken)
        .expect(HttpStatus.NotFound);
    });
  });
