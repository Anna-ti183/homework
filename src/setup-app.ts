import express, { Express, Request, Response } from 'express';
import { HttpStatus } from './core/types/http-statuses'
import { BLOGS_PATH } from './blogs/constant/blogs.paths';
import { blogsRouter } from './blogs/routers/blogs.router';
import { POSTS_PATH } from './posts/constants/posts.path';
import { postsRouter } from './posts/routers/posts.router';
import { TESTING_PATH } from './testing/constants/testing.paths';
import { testingRouter } from './testing/routers/testing.router';
import { USERS_PATH } from './users/constant/users.paths';
import { usersRouter } from './users/routers/users.router';
import { AUTH_PATH } from './auth/constant/auth.paths';
import { authRouter } from './auth/routers/auth.router';
import { COMMENTS_PATH } from './comments/constants/comments.path';
import { commentsRouter } from './comments/router/comment.router';



export const setupApp = (app: Express) => {
  // express.json() парсит JSON из тела запроса и кладёт его в req.body.
  app.use(express.json());

  // Health-check: простой ответ, что сервер жив.
  app.get('/', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send('Hello world!');
  });


  // Каждый модуль подключается по своему базовому пути.
  app.use(POSTS_PATH, postsRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(AUTH_PATH, authRouter);
  app.use(COMMENTS_PATH, commentsRouter);


  return app;
};