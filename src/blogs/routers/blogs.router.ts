import { RequestHandler, Router } from "express";
import { BLOGS_ROUTERS } from "../constant/blogs.paths";
import { getBlogsHandler } from "./handlers/get-blogs.handler";
import { getIdBlogHandler } from "./handlers/get-Id-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { superAdminGuardMiddleware } from "../../auth.middleware/middleware/super-admin.guard.middleware";
import { idValidation } from "../../core/middlewares.validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { blogInputDtoValidation, blogPostInputDtoValidation } from "../validation/blog.input-dto.validation-middlewares";
import { createPostByBlogHandler } from "./handlers/create-post-by-blog.handler";
import { getPostsByBlogHandler } from "./handlers/get-posts-by-blog.handler";
import { paginationAndSortingValidation } from "../../core/middlewares.validation/query-pagination-sorting.validation.middleware";
import { BlogSortField } from "./input/blog-sort-field";
import { sanitizeQueryParams } from "../../core/middlewares.validation/sanitize-query.middleware";
import { PostSortField } from "../../posts/routers/input/post-sort.field";



export const blogsRouter = Router({});


// Пути маршрутов берём из констант модуля, а не из строковых литералов.
// Каждая цепочка: валидация -> проверка её результата -> handler.

blogsRouter
    .get(
        BLOGS_ROUTERS.ROOT,
        paginationAndSortingValidation(BlogSortField),
        inputValidationResultMiddleware,
        sanitizeQueryParams,
        getBlogsHandler as unknown as RequestHandler,
    )

    .get(
        BLOGS_ROUTERS.BY_ID,
        idValidation,
        inputValidationResultMiddleware, // проверяет, прошли ли данные валидацию
        getIdBlogHandler,
    )

    .get(
        BLOGS_ROUTERS.POSTS,
        idValidation,   // 1. Валидация id
        paginationAndSortingValidation(PostSortField), // 2. Валидация query
        inputValidationResultMiddleware, // 3. Проверка ВСЕХ ошибок
        sanitizeQueryParams,     // 4. Применение преобразований
        getPostsByBlogHandler as unknown as RequestHandler // 5. Хэндлер
    )

    .post(
        BLOGS_ROUTERS.ROOT,
        superAdminGuardMiddleware, //АВТОРИЗАЦИЯ
        blogInputDtoValidation, // middleware-валидатор тела запроса на создание
        inputValidationResultMiddleware, // проверяет, прошли ли данные валидацию
        createBlogHandler,
    )

    .post(
        BLOGS_ROUTERS.POSTS,
        superAdminGuardMiddleware,
        idValidation,
        blogPostInputDtoValidation,
        inputValidationResultMiddleware,
        createPostByBlogHandler,
    )

    .put(
        BLOGS_ROUTERS.BY_ID,
        superAdminGuardMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        updateBlogHandler,
    )

    .delete(
        BLOGS_ROUTERS.BY_ID,
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteBlogHandler,
    );
