import "reflect-metadata";
import { Container } from "inversify";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsRepository } from "./blogs/repositories/blogs.repository";
import { BlogsController } from "./blogs/routers/handlers/handlers";
import { BlogsQueryRepository } from "./blogs/repositories/blogs.query-repository";
import { CommentsService } from "./comments/application/comments.service";
import { CommentsQueryRepository } from "./comments/repositories/comments.query-repositories";
import { CommentsRepository } from "./comments/repositories/comments.repositories";
import { CommentsController } from "./comments/router/handler/handler";
import { PostsService } from "./posts/application/posts.service";
import { PostsRepository } from "./posts/repositories/posts.repositories";
import { PostsController } from "./posts/routers/handlers/handlers";
import { PostsQueryRepository } from "./posts/repositories/posts.query-repositories"
import { UsersQueryRepository } from "./users/repositories/users.query-repository";
import { UsersRepository } from "./users/repositories/users.repository";
import { UsersService } from "./users/application/users.service";
import { UsersController } from "./users/routers/handlers/handler";
import { AuthController } from "./auth/routers/handlers/handler";
import { AuthService } from "./auth/application/auth.service";
import { SecurityDevicesController } from "./securityDevices/routers/handler/handler";

export const container = new Container();
container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepository).to(PostsRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)

container.bind(SecurityDevicesController).to(SecurityDevicesController)

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)

/*
const objects: any[] = []

const blogsRepository = new BlogsRepository()
objects.push(blogsRepository)
const blogsQueryRepository = new BlogsQueryRepository()
objects.push(blogsQueryRepository)
const blogsService = new BlogsService(blogsRepository)
objects.push(blogsService)

const postsRepository = new PostsRepository()
objects.push(postsRepository)
const postsQueryRepository = new PostsQueryRepository()
objects.push(postsQueryRepository)
const postsService = new PostsService(postsRepository, blogsQueryRepository)
objects.push(postsService)

export const usersRepository = new UsersRepository()
objects.push(usersRepository)
const usersQueyRepository = new UsersQueryRepository()
objects.push(usersQueyRepository)
const usersService = new UsersService(usersRepository)
objects.push(usersService)


const commentsRepository = new CommentsRepository()
objects.push(commentsRepository)
const commentQueryRepository = new CommentsQueryRepository()
objects.push(commentQueryRepository)
const commentsService = new CommentsService(commentsRepository, commentQueryRepository, postsQueryRepository, usersQueyRepository)
objects.push(commentsService)

const authService = new AuthService(usersRepository)
objects.push(authService)

export const securityDevicesController = new SecurityDevicesController(authService)
objects.push(securityDevicesController)

export const blogsController = new BlogsController (blogsService, postsService, blogsQueryRepository, postsQueryRepository)
objects.push(blogsController)

export const postsController = new PostsController(postsService,  commentQueryRepository, commentsService, postsQueryRepository )
objects.push(postsController)

export const commentsController = new CommentsController(commentsService, commentQueryRepository)
objects.push(commentsController)

export const usersController = new UsersController(usersService, usersQueyRepository)
objects.push(usersController)

export const authController = new AuthController(authService, usersRepository)
objects.push(authController)


export const ioc = {
  getInstance<T>(ClassType: any) {
    const targetInstance = objects.find((object) => object instanceof ClassType);
 
    return targetInstance as T;
  },

}
*/


