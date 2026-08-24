

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
import { getPostIdCommentHandler } from "./handlers/get-postId-comment.handler";
import { createCommentHandler } from "./handlers/create-postId-comments";
import { accessTokenGuard } from "../../auth/middleware/access-token.guard";
import { commentInputDtoValidation } from "../../comments/validation/comment.input.dto.validation.middleware";
import { CommentSortField } from "../../comments/router/input/comment-sort-field";


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

    .post(
        POSTS_ROUTERS.COMMENTS,
        accessTokenGuard, // проверяем JWT
        commentInputDtoValidation, //проверяем валидацию - content
        inputValidationResultMiddleware, // если ошибки
        createCommentHandler,
    )

    .get(
        POSTS_ROUTERS.COMMENTS,
        paginationAndSortingValidation(CommentSortField), //проверяем query
        inputValidationResultMiddleware, // если ошибки
        sanitizeQueryParams,
        getPostIdCommentHandler,
    )
