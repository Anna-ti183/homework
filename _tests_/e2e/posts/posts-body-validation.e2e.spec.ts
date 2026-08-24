import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { POSTS_PATH } from "../../../src/posts/constants/posts.path";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { SETTINGS } from "../../../src/settings/config";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { getPostDto } from "../../utils/posts/get-post-dto";
import { createBlog } from "../../utils/blogs/create-blog";
import { getPostById } from "../../utils/posts/get-post-by-id";
import { createPost } from "../../utils/posts/create-post";
import { PostAttributes } from "../../../src/posts/application/dtos/post-attributes";
import { createUser } from "../../utils/users/create-user";
import { loginUserAuth } from "../../utils/auth/create-login-auth";


describe('Post API body validation check', () => {
    const app = express();
    setupApp(app);


    let blog;
    let correctTestPostData: PostAttributes;
    let accessToken: string; //Создаём переменную, в которой будем хранить JWT. Она доступна всем тестам внутри describe.
    const content = 'This is a valid comment'; //создаем общую переменную  content чтобы не создавать ее в каждом нужном тесте 

    const adminToken = generateBasicAuthToken();

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL);
        await clearDb(app);
        blog = await createBlog(app);
        correctTestPostData = getPostDto(blog.id);

        await createUser(app); //используем созданного юзера

        const res = await loginUserAuth(app); //Выполняем настоящий login через API и получаем ответ сервера.

        expect(res.status).toBe(HttpStatus.Ok); //Проверяем, что login действительно успешный — сервер вернул 200.

        accessToken = res.body.accessToken; // Достаём JWT из ответа и сохраняем его в нашу переменную accessToken
    });

    afterAll(async () => {
        await stopDb();
    });


    it(`❌ should not create post when incorrect body passed; POST /api/posts'`, async () => {

        await request(app)
            .post(POSTS_PATH)
            .send(correctTestPostData)
            .expect(HttpStatus.Unauthorized);


        const invalidDataSet1 = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', generateBasicAuthToken())
            .send({
                title: '   ', //  ❌ empty string
                shortDescription: 1, //  ❌ not a string
                content: '   ', //  ❌ empty string
                blogId: '   ', //  ❌ empty string
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

        const invalidDataSet2 = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', generateBasicAuthToken())
            .send({
                title: 'Test',
                shortDescription: '', //  ❌ empty string
                content: 2,  //  ❌ not a string
                blogId: 3, //  ❌ not a string
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);

        const invalidDataSet3 = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', generateBasicAuthToken())
            .send({
                title: 'Test',
                shortDescription: 'My test',
                content: 'My life test',
                blogId: '', //  ❌ empty string
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

        // check что никто не создался
        const postListResponse = await request(app)
            .get(POSTS_PATH)
            .set('Authorization', adminToken);
        expect(postListResponse.body.items).toHaveLength(0);
    });


    it('❌ should not update post when incorrect data passed; PUT /api/posts/:id', async () => {

        const createdPost = await createPost(app, correctTestPostData);


        const invalidDataSet1 = await request(app)
            .put(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', generateBasicAuthToken())
            .send({
                title: '   ', //  ❌ empty string
                shortDescription: '   ', //  ❌ empty string
                content: '   ', //  ❌ empty string
                blogId: '   ', //  ❌ empty string
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

        const invalidDataSet2 = await request(app)
            .put(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', generateBasicAuthToken())
            .send({
                title: '', //  ❌ empty string
                shortDescription: '', //  ❌ empty string
                content: '', //  ❌ empty string
                blogId: '', //  ❌ empty string
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorsMessages).toHaveLength(4);

        const invalidDataSet3 = await request(app)
            .put(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', generateBasicAuthToken())
            .send({
                title: 'Test',
                shortDescription: 'My test',
                content: 'My life test',
                blogId: '', //  ❌ empty string
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

        const postResponse = await getPostById(app, createdPost.id);

        expect(postResponse).toEqual({
            ...createdPost,
        });
    });


    //  не должен возвращать комментарии, Если пост с переданным postId не существует;
    it('❌ should not return comments if the post with the specified postId does not exist; GET /api/posts/:postId/comments', async () => {
        await request(app)
            .get(`${POSTS_PATH}/66c9ff8a3d4f12a3b4c5e6a5/comments`)
            .expect(HttpStatus.NotFound);
    })

    //не должен создавать комментарий, если переданы некорректные данные
    it('❌ should not create a comment if incorrect data is passed; POST /api/posts/:postId/comments', async () => {
        const post = await createPost(app)
        const postId = post.id
        await request(app)
            .post(`${POSTS_PATH}/${postId}/comments`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                content: 'I like test' //  ❌ short description
            })
            .expect(HttpStatus.BadRequest)
    });

    //не должен создавать комментарий без авторизации;
    it('❌ should not create a comment without authorization; POST /api/posts/:postId/comments', async () => {
        const post = await createPost(app)
        const postId = post.id
        await request(app)
            .post(`${POSTS_PATH}/${postId}/comments`)
            .set('Content-Type', 'application/json')
            .send({ content })
            .expect(HttpStatus.Unauthorized)
    });

    //не должен создавать комментарий, если пост с указанным postId не существует
    it('❌ should not create a comment if the post with the specified postId does not exist; POST /api/posts/:postId/comments', async() => {
        const post = await createPost(app)
        await request(app)
            .post(`${POSTS_PATH}/66c9ff8a3d4f12a3b4c5e6a5/comments`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content })
            .expect(HttpStatus.NotFound)
    });
   
});

