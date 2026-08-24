import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { AUTH_ROUTERS } from "../constant/auth.paths";
import { authInputDtoValidation } from "../validation/auth.input-dto.validation-middleware";
import { loginHandler } from "./handlers/login.handler";
import { accessTokenGuard } from "../middleware/access-token.guard";
import { meHandler } from "./handlers/get-auth-me.handler";



export const authRouter = Router({});

authRouter
.post(
    AUTH_ROUTERS.LOGIN,
    authInputDtoValidation,
    inputValidationResultMiddleware,
    loginHandler
)

.get(
    AUTH_ROUTERS.ME,
    accessTokenGuard,
    meHandler
)
