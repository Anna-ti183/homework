import { Router } from "express";
import { BLOGS_ROUTERS } from "../constant/blogs.paths";
import { superAdminGuardMiddleware } from "../../auth.middleware/middleware/super-admin.guard.middleware";
import { idValidation } from "../../core/middlewares.validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { blogInputDtoValidation, blogPostInputDtoValidation } from "../validation/blog.input-dto.validation-middlewares";
import { paginationAndSortingValidation } from "../../core/middlewares.validation/query-pagination-sorting.validation.middleware";
import { BlogSortField } from "./input/blog-sort-field";
import { sanitizeQueryParams } from "../../core/middlewares.validation/sanitize-query.middleware";
import { PostSortField } from "../../posts/routers/input/post-sort.field";
import { container } from "../../composition-root";
import { BlogsController } from "./handlers/handlers";

const blogsController = container.get(BlogsController)

export const blogsRouter = Router({});


// Пути маршрутов берём из констант модуля, а не из строковых литералов.
// Каждая цепочка: валидация -> проверка её результата -> handler.

blogsRouter
    .get(
        BLOGS_ROUTERS.ROOT,
        paginationAndSortingValidation(BlogSortField),
        inputValidationResultMiddleware,
        sanitizeQueryParams,
        blogsController.getBlogs.bind(blogsController) //as unknown as RequestHandler,
    )

    .get(
        BLOGS_ROUTERS.BY_ID,
        idValidation,
        inputValidationResultMiddleware, // проверяет, прошли ли данные валидацию
        blogsController.getIdBlog.bind(blogsController),
    )

    .get(
        BLOGS_ROUTERS.POSTS,
        idValidation,   // 1. Валидация id
        paginationAndSortingValidation(PostSortField), // 2. Валидация query
        inputValidationResultMiddleware, // 3. Проверка ВСЕХ ошибок
        sanitizeQueryParams,     // 4. Применение преобразований
        blogsController.getPostByBlog.bind(blogsController) //as unknown as RequestHandler // 5. Хэндлер
    )

    .post(
        BLOGS_ROUTERS.ROOT,
        superAdminGuardMiddleware, //АВТОРИЗАЦИЯ
        blogInputDtoValidation, // middleware-валидатор тела запроса на создание
        inputValidationResultMiddleware, // проверяет, прошли ли данные валидацию
        blogsController.createBlog.bind(blogsController),
    )

    .post(
        BLOGS_ROUTERS.POSTS,
        superAdminGuardMiddleware,
        idValidation,
        blogPostInputDtoValidation,
        inputValidationResultMiddleware,
        blogsController.createPostByBlog.bind(blogsController),
    )

    .put(
        BLOGS_ROUTERS.BY_ID,
        superAdminGuardMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        blogsController.updateBlog.bind(blogsController),
    )

    .delete(
        BLOGS_ROUTERS.BY_ID,
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        blogsController.deleteBlog.bind(blogsController),
    );
