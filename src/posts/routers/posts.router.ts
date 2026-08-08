

import { RequestHandler, Router } from "express";
import { POSTS_ROUTERS } from "../constants/posts.path";
import { getPostsHandler } from "./handlers/get-posts.handler";
import { idValidation } from "../../core/middlewares.validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { createPostHandler } from "./handlers/create-post.handler";
import { superAdminGuardMiddleware } from "../../auth.middleware/middleware/super-admin.guard.middleware";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { postInputDtoValidator } from "../validation/post.input-dto.validation";
import { getIdPostHandler } from "./handlers/get-Id-post.handler";
import { paginationAndSortingValidation } from "../../core/middlewares.validation/query-pagination-sorting.validation.middleware";
import { PostSortField } from "./input/post-sort.field";
import { sanitizeQueryParams } from "../../core/middlewares.validation/sanitize-query.middleware";


export const postsRouter = Router({});


postsRouter

    .get(
        POSTS_ROUTERS.ROOT,
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        sanitizeQueryParams,
        getPostsHandler as unknown as RequestHandler,
    )

    .get(
        POSTS_ROUTERS.BY_ID,
        idValidation,
        inputValidationResultMiddleware,
        getIdPostHandler,
    )

    .post(
        POSTS_ROUTERS.ROOT,
        superAdminGuardMiddleware,
        postInputDtoValidator, // middleware-валидатор тела запроса на создание
        inputValidationResultMiddleware,
        createPostHandler,
    )

    .put(
        POSTS_ROUTERS.BY_ID,
        superAdminGuardMiddleware,
        idValidation,
        postInputDtoValidator,
        inputValidationResultMiddleware,
        updatePostHandler,
    )

    .delete(
        POSTS_ROUTERS.BY_ID,
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deletePostHandler,
    )
