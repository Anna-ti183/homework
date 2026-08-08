//Отправляет POST-запрос на /api/blogs и возвращает созданный блог.

import request from "supertest";
import { Express } from "express";
import { getBlogDto } from "./get-blog-dto";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { BLOGS_PATH } from "../../../src/blogs/constant/blogs.paths";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blog-attributes";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { BlogOutput } from "../../../src/blogs/output/blog.output";

export async function createBlog(
    app: Express,                                //Мы передаём в функцию наш Express-сервер, чтобы делать HTTP-запросы.
    blogDto?: BlogAttributes,       
): Promise<BlogOutput> {        

    // ✅ ПЛОСКАЯ СТРУКТУРА
    const testBlogData =  {...getBlogDto(), ...blogDto };
   

    
    /*const createBlogResponse — объявляем переменную, в которую сохраним ответ от сервера.///await — ждём, пока сервер ответит (потому что запрос асинхронный).///request(app) — создаём тестовый HTTP-запрос к нашему приложению (из библиотеки supertest).*/
    const createdBlogResponse = await request(app)
        .post(BLOGS_PATH)  //.post(BLOGS_PATH) — указываем, что это POST-запрос на путь /api/blogs (значение из константы).
        .set('Authorization', generateBasicAuthToken()) // добавляем заголовок к запросу:Authorization — ключ заголовка.generateBasicAuthToken() — значение (токен для авторизации админа).
        .send(testBlogData) //отправляем тело запроса (наши данные для создания блога) в формате JSON.
        .expect(HttpStatus.Created);
 
    return createdBlogResponse.body//возвращаем  тело ответа от сервера (созданный блог с полями (id, name, description, websiteUrl)
};
