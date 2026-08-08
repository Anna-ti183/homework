//Отправляет GET-запрос на /api/blogs/:id и возвращает блог.     Зачем: Чтобы в тестах не писать каждый раз:
/*const response = await request(app)
    .get(`/api/blogs/${id}`)
    .set('Authorization', adminToken)
    .expect(200);
const blog = response.body;*/

import request from 'supertest';
import { Express } from 'express';
import { BLOGS_PATH } from "../../../src/blogs/constant/blogs.paths";
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { BlogOutput } from '../../../src/blogs/output/blog.output';


export async function getBlogById(
  app: Express,  //Передаём Express-приложение, чтобы делать HTTP-запросы через supertest.
  blogId: string, // ID блога, который мы хотим получить.
): Promise<BlogOutput> {  

  const blogResponse = await request(app) //создаем переменную в которой сохраним ответ асинхронный тестовый HTTP-запрос к нашему приложению (из библиотеки супертест)
    .get(`${BLOGS_PATH}/${blogId}`) // get-запрос => /api/blogs  => ID блога, который мы передали = /api/blogs/1
    .set('Authorization', generateBasicAuthToken()) //добавляем заголовок к запросу
    .expect(HttpStatus.Ok);

  return blogResponse.body // тело ответа от сервера (это и есть объект блога с полями id, name, description, websiteUrl).
}