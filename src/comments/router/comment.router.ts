import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { getCommentHandler } from "./handler/get-id.comment.handler";
import { COMMENTS_ROUTER } from "../constants/comments.path";
import { idValidation } from "../../core/middlewares.validation/params-id.validation.middleware";
import { deleteCommentHandler } from "./handler/delete.comment.handler";
import { accessTokenGuard } from "../../auth/middleware/access-token.guard";
import { commentInputDtoValidation } from "../validation/comment.input.dto.validation.middleware";
import { updateCommentHandler } from "./handler/update.comment.handler";

export const commentsRouter = Router({});

commentsRouter

    .get(
        COMMENTS_ROUTER.BY_ID,
        idValidation,
        inputValidationResultMiddleware,
        getCommentHandler
    )

    .put(
        COMMENTS_ROUTER.BY_ID,
        accessTokenGuard,
        idValidation,
        commentInputDtoValidation,
        inputValidationResultMiddleware,
        updateCommentHandler
    )

    .delete(
        COMMENTS_ROUTER.BY_ID,
        accessTokenGuard,
        idValidation,
        inputValidationResultMiddleware,
        deleteCommentHandler
    )
