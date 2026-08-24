import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { POSTS_PATH } from "../../../src/posts/constants/posts.path";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { SETTINGS } from "../../../src/settings/config";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/clear-db";
import { createPost } from "../../utils/posts/create-post";
import { getPostById } from "../../utils/posts/get-post-by-id";
import { PostAttributes } from "../../../src/posts/application/dtos/post-attributes";
import { updatePost } from "../../utils/posts/update-post";
import { loginUserAuth } from "../../utils/auth/create-login-auth";
import { createUser } from "../../utils/users/create-user";

describe('Posts API', () => {
    const app = express();
    setupApp(app);

    const adminToken = generateBasicAuthToken();
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

    it('✅ should create post; POST /api/posts', async () => { // Создает блог → создает пост с ID этого блога
        await createPost(app);                                     // Возвращает созданный пост
    });

    // ✅ GET — получение всех постов
    it('✅ should return posts list; GET /api/posts', async () => {

        await createPost(app);

        const response = await request(app)
            .get(POSTS_PATH)
            .expect(HttpStatus.Ok);

        // Проверяем, что это массив
        expect(response.body.items).toBeInstanceOf(Array);
        expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    });


    // ✅ GET — получение поста по ID
    it('✅ should return post by id; GET /api/posts/:id', async () => {

        const createdPost = await createPost(app);  //Создаем пост
        const createdPostId = createdPost.id;

        const getPost = await getPostById(app, createdPostId);  //Запрашиваем этот же пост по ID

        expect(getPost).toEqual({
            ...createdPost,
            id: expect.any(String),
            createdAt: expect.any(String),
        });
    });



    // ✅ PUT — обновление поста
    it('✅ should update post; PUT /api/posts/:id', async () => {
        const createdPost = await createPost(app);

        const postUpdateData: PostAttributes = {
            title: 'Test Post',
            shortDescription: 'Test shortDescription',
            content: 'Test content',
            blogId: createdPost.blogId, // ← берем из созданного поста
        };

        await updatePost(app, createdPost.id, createdPost.blogId, postUpdateData);

        const postResponse = await getPostById(app, createdPost.id);

        expect(postResponse).toEqual({
            title: postUpdateData.title,
            shortDescription: postUpdateData.shortDescription,
            content: postUpdateData.content,
            blogId: createdPost.blogId,
            blogName: expect.any(String), // ← не знаем точное значение, но знаем что строка
            createdAt: expect.any(String), // ← не знаем точное значение, но знаем что строка
            id: expect.any(String), // ← не знаем точное значение, но знаем что строка
        });
    });

    // ✅ DELETE — удаление поста
    it('✅ should delete post; DELETE /api/posts/:id', async () => {
        const createdPost = await createPost(app);

        await request(app)
            .delete(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);

        await request(app)
            .get(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NotFound);

    });

    it('✅ should Post post; POSR /api/posts/:id', async () => {


        await request(app)
            .post('/blogs/6896f3a2b7c84d1e9f05a6c3/posts')
            .set('Authorization', adminToken)
            .send({ "content": "new post content", "shortDescription": "description", "title": "post title" })
            .expect(HttpStatus.NotFound);

        await request(app)
            .get('/blogs/6896f3a2b7c84d1e9f05a6c3/posts')
            .set('Authorization', adminToken)
            .expect(HttpStatus.NotFound);
    });

    //должен возвращать комментарии, если пост с указанным postId существует
    it('✅ should return comments if the post with the specified postId exists; GET /api/posts/:postId/comments', async () => {
        const post = await createPost(app)
        const postId = post.id
        await request(app)
            .get(`${POSTS_PATH}/${postId}/comments`)
            .expect(HttpStatus.Ok)
    });

    //должен создать новый комментарий для существующего поста
    it('✅ should create a new comment for an existing post; POST /api/posts/:postId/comments', async () => {
        const post = await createPost(app)
        const postId = post.id
        await request(app)
            .post(`${POSTS_PATH}/${postId}/comments`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content })
            .expect(HttpStatus.Created)
    })

});