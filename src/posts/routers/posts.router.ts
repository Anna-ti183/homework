import { Router } from "express";
import { POSTS_ROUTERS } from "../constants/posts.path";
import { idValidation } from "../../core/middlewares.validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { superAdminGuardMiddleware } from "../../auth.middleware/middleware/super-admin.guard.middleware";
import { postInputDtoValidator } from "../validation/post.input-dto.validation";
import { paginationAndSortingValidation } from "../../core/middlewares.validation/query-pagination-sorting.validation.middleware";
import { PostSortField } from "./input/post-sort.field";
import { sanitizeQueryParams } from "../../core/middlewares.validation/sanitize-query.middleware";
import { accessTokenGuard } from "../../auth/middleware/access-token.guard";
import { commentInputDtoValidation } from "../../comments/validation/comment.input.dto.validation.middleware";
import { CommentSortField } from "../../comments/router/input/comment-sort-field";
import { container } from '../../composition-root'
import { PostsController } from "./handlers/handlers";


const postsController = container.get(PostsController)

export const postsRouter = Router({});


postsRouter

    .get(
        POSTS_ROUTERS.ROOT,
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        sanitizeQueryParams,
        postsController.getPosts.bind(postsController) //as unknown as RequestHandler,
    )

    .get(
        POSTS_ROUTERS.BY_ID,
        idValidation,
        inputValidationResultMiddleware,
        postsController.getIdPost.bind(postsController),
    )

    .post(
        POSTS_ROUTERS.ROOT,
        superAdminGuardMiddleware,
        postInputDtoValidator, // middleware-валидатор тела запроса на создание
        inputValidationResultMiddleware,
        postsController.createPost.bind(postsController),
    )

    .put(
        POSTS_ROUTERS.BY_ID,
        superAdminGuardMiddleware,
        idValidation,
        postInputDtoValidator,
        inputValidationResultMiddleware,
        postsController.updatePost.bind(postsController),
    )

    .delete(
        POSTS_ROUTERS.BY_ID,
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        postsController.deletePost.bind(postsController),
    )

    .post(
        POSTS_ROUTERS.COMMENTS,
        accessTokenGuard, // проверяем JWT
        commentInputDtoValidation, //проверяем валидацию - content
        inputValidationResultMiddleware, // если ошибки
        postsController.createPostIdComment.bind(postsController),
    )

    .get(
        POSTS_ROUTERS.COMMENTS,
        paginationAndSortingValidation(CommentSortField), //проверяем query
        inputValidationResultMiddleware, // если ошибки
        sanitizeQueryParams,
        postsController.getPostIdComment.bind(postsController),
    )
