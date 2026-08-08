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


describe('Post API body validation check', () => {
    const app = express();
    setupApp(app);


    let blog;
    let correctTestPostData: PostAttributes; 

    const adminToken = generateBasicAuthToken();

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL);
        await clearDb(app);
        blog = await createBlog(app);
        correctTestPostData = getPostDto(blog.id);
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








    });

