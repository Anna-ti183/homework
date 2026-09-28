import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { COMMENTS_ROUTER } from "../constants/comments.path";
import { idValidation } from "../../core/middlewares.validation/params-id.validation.middleware";
import { accessTokenGuard } from "../../auth/middleware/access-token.guard";
import { commentInputDtoValidation } from "../validation/comment.input.dto.validation.middleware";
import { container } from "../../composition-root";
import { CommentsController } from "./handler/handler";

const commentsController = container.get(CommentsController)

export const commentsRouter = Router({});

commentsRouter

    .get(
        COMMENTS_ROUTER.BY_ID,
        idValidation,
        inputValidationResultMiddleware,
        commentsController.getIdComment.bind(commentsController)
    )

    .put(
        COMMENTS_ROUTER.BY_ID,
        accessTokenGuard,
        idValidation,
        commentInputDtoValidation,
        inputValidationResultMiddleware,
        commentsController.updateComment.bind(commentsController)
    )

    .delete(
        COMMENTS_ROUTER.BY_ID,
        accessTokenGuard,
        idValidation,
        inputValidationResultMiddleware,
        commentsController.deleteComment.bind(commentsController)
    )
