import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { AUTH_ROUTERS } from "../constant/auth.paths";
import { authInputDtoRegistrationValidation, authInputDtoRegistrConfirmValidator, authInputDtoValidation } from "../validation/auth.input-dto.validation-middleware";
import { loginHandler } from "./handlers/login.handler";
import { accessTokenGuard } from "../middleware/access-token.guard";
import { meHandler } from "./handlers/get-auth-me.handler";
import { registrationHandler } from "./handlers/registration.handler";
import { registrConfirmHandler } from "./handlers/registr-confirm.handler";
import { authInputDtoRegistrEmailResendingValidation } from "../validation/auth.input-dto.validation-middleware"
import { registrEmailResendingHandler } from "./handlers/registr-Email-Resending.handler";
import { refreshTokenHandler } from "./handlers/refreshToken.handler";
import { logoutHandler } from "./handlers/logout.handler";
import { rateLimitMiddleware } from "../../core/middlewares.validation/rate-limit.middleware";



export const authRouter = Router({});

authRouter
.post(
    AUTH_ROUTERS.LOGIN,
    authInputDtoValidation,
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    loginHandler
)

.get(
    AUTH_ROUTERS.ME,
    accessTokenGuard,
    meHandler
)

.post(
    AUTH_ROUTERS.REGISTRATION,
    authInputDtoRegistrationValidation,
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    registrationHandler
)

.post(
    AUTH_ROUTERS.REGISTRATION_CONFIRMATION,
    authInputDtoRegistrConfirmValidator,
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    registrConfirmHandler
)

.post(
    AUTH_ROUTERS.REGISTRATION_EMAIL_RESENDING,
    authInputDtoRegistrEmailResendingValidation,
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    registrEmailResendingHandler
)

.post(
    AUTH_ROUTERS.REFRESH_TOKEN,
    refreshTokenHandler
)

.post(
    AUTH_ROUTERS.LOGOUT,
    logoutHandler
)
