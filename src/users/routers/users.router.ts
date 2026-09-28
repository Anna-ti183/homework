import { Router } from "express";
import { USERS_ROUTERS } from "../constant/users.paths";
import { paginationAndSortingValidation } from "../../core/middlewares.validation/query-pagination-sorting.validation.middleware";
import { UserSortField } from "./input/user-sort-field";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { sanitizeQueryParams } from "../../core/middlewares.validation/sanitize-query.middleware";
import { superAdminGuardMiddleware } from "../../auth.middleware/middleware/super-admin.guard.middleware";
import { userInputDtoValidation } from "../validation/user.input-dto.validation-middlewares";
import { idValidation } from "../../core/middlewares.validation/params-id.validation.middleware";
import { container } from "../../composition-root";
import { UsersController } from "./handlers/handler";


const usersController = container.get(UsersController)

export const usersRouter = Router({});

usersRouter
    .get(
        USERS_ROUTERS.ROOT,
        superAdminGuardMiddleware,
        paginationAndSortingValidation(UserSortField),
        inputValidationResultMiddleware,
        sanitizeQueryParams,
        usersController.getUsers.bind(usersController),
    )

    .post(
        USERS_ROUTERS.ROOT,
        superAdminGuardMiddleware,
        userInputDtoValidation,
        inputValidationResultMiddleware,
        usersController.createUser.bind(usersController),
    )

    .delete(
        USERS_ROUTERS.BY_ID,
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        usersController.deleteUser.bind(usersController),
    );