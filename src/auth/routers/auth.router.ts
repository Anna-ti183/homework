import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { AUTH_ROUTERS } from "../constant/auth.paths";
import { authInputDtoRegistrationValidation, authInputDtoRegistrConfirmValidator, authInputDtoValidation } from "../validation/auth.input-dto.validation-middleware";
import { accessTokenGuard } from "../middleware/access-token.guard";
import { authInputDtoRegistrEmailResendingValidation } from "../validation/auth.input-dto.validation-middleware"
import { rateLimitMiddleware } from "../../core/middlewares.validation/rate-limit.middleware";
import { container } from "../../composition-root";
import { AuthController } from "./handlers/handler";

const authController = container.get(AuthController)

export const authRouter = Router({});

authRouter
.post(
    AUTH_ROUTERS.LOGIN,
    authInputDtoValidation,
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    authController.login.bind(authController)
)

.get(
    AUTH_ROUTERS.ME,
    accessTokenGuard,
    authController.getAuthMe.bind(authController)
)

.post(
    AUTH_ROUTERS.REGISTRATION,
    authInputDtoRegistrationValidation,
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    authController.registration.bind(authController)
)

.post(
    AUTH_ROUTERS.REGISTRATION_CONFIRMATION,
    authInputDtoRegistrConfirmValidator,
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    authController.registrationConfirmation.bind(authController)
)

.post(
    AUTH_ROUTERS.REGISTRATION_EMAIL_RESENDING,
    authInputDtoRegistrEmailResendingValidation,
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    authController.registrationEmailResending.bind(authController)
)

.post(
    AUTH_ROUTERS.REFRESH_TOKEN,
    authController.refreshToken.bind(authController)
)

.post(
    AUTH_ROUTERS.LOGOUT,
    authController.logout.bind(authController)
)
