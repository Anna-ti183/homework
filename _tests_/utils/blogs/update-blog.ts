//Отправляет PUT-запрос на /api/blogs/:id с новыми данными.     Зачем: Чтобы в тестах не писать каждый раз:
/*await request(app)
   .put(`/api/blogs/${id}`)
   .set('Authorization', adminToken)
   .send(updatedData)
   .expect(204);*/


import request from 'supertest';
import { Express } from 'express';
import { BLOGS_PATH } from '../../../src/blogs/constant/blogs.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { getBlogDto } from './get-blog-dto';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';

export async function updateBlog(
  app: Express,
  blogId: string,
  blogDto?: BlogAttributes,
): Promise<void> {

  const testBlogData: BlogAttributes = { ...getBlogDto(), ...blogDto };

  

  await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent);

  return;
}

