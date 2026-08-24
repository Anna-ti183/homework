import { RequestHandler, Router } from "express";
import { USERS_ROUTERS } from "../constant/users.paths";
import { paginationAndSortingValidation } from "../../core/middlewares.validation/query-pagination-sorting.validation.middleware";
import { UserSortField } from "./input/user-sort-field";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { sanitizeQueryParams } from "../../core/middlewares.validation/sanitize-query.middleware";
import { getUserHandler } from "./handlers/get-users.handler";
import { superAdminGuardMiddleware } from "../../auth.middleware/middleware/super-admin.guard.middleware";
import { userInputDtoValidation } from "../validation/user.input-dto.validation-middlewares";
import { createUserHandler } from "./handlers/create-user.handler";
import { idValidation } from "../../core/middlewares.validation/params-id.validation.middleware";
import { deleteUserHandler } from "./handlers/delete-user.handler";

export const usersRouter = Router({});

usersRouter
    .get(
        USERS_ROUTERS.ROOT,
        superAdminGuardMiddleware,
        paginationAndSortingValidation(UserSortField),
        inputValidationResultMiddleware,
        sanitizeQueryParams,
        getUserHandler as unknown as RequestHandler,
    )

    .post(
        USERS_ROUTERS.ROOT,
        superAdminGuardMiddleware,
        userInputDtoValidation,
        inputValidationResultMiddleware,
        createUserHandler,
    )

    .delete(
        USERS_ROUTERS.BY_ID,
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteUserHandler,
    );