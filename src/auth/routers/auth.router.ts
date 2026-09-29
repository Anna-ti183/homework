import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares.validation/input-validator-result.middleware";
import { AUTH_ROUTERS } from "../constant/auth.paths";
import { authInputDtoNewPasswordValidation, authInputDtoPasswordRecoveryValidation, authInputDtoRegistrationValidation, authInputDtoRegistrConfirmValidator, authInputDtoValidation } from "../validation/auth.input-dto.validation-middleware";
import { accessTokenGuard } from "../middleware/access-token.guard";
import { authInputDtoRegistrEmailResendingValidation } from "../validation/auth.input-dto.validation-middleware"
import { RateLimitMiddleware } from "../../core/middlewares.validation/rate-limit.middleware";
import { container } from "../../composition-root";
import { AuthController } from "./handlers/handler";

const authController = container.get(AuthController)
const rateLimitMiddleware = container.get(RateLimitMiddleware)

export const authRouter = Router({});

authRouter
.post(
    AUTH_ROUTERS.LOGIN,
    authInputDtoValidation,
    inputValidationResultMiddleware,
    rateLimitMiddleware.rateLimitMiddleware.bind(rateLimitMiddleware),
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
    rateLimitMiddleware.rateLimitMiddleware.bind(rateLimitMiddleware),
    authController.registration.bind(authController)
)

.post(
    AUTH_ROUTERS.REGISTRATION_CONFIRMATION,
    authInputDtoRegistrConfirmValidator,
    inputValidationResultMiddleware,
    rateLimitMiddleware.rateLimitMiddleware.bind(rateLimitMiddleware),
    authController.registrationConfirmation.bind(authController)
)

.post(
    AUTH_ROUTERS.REGISTRATION_EMAIL_RESENDING,
    authInputDtoRegistrEmailResendingValidation,
    inputValidationResultMiddleware,
    rateLimitMiddleware.rateLimitMiddleware.bind(rateLimitMiddleware),
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

.post(
    AUTH_ROUTERS.PASSWORD_RECOVERY,
    authInputDtoPasswordRecoveryValidation,
    inputValidationResultMiddleware,
    rateLimitMiddleware.rateLimitMiddleware.bind(rateLimitMiddleware),
    authController.passwordRecovery.bind(authController)
)

.post(
    AUTH_ROUTERS.NEW_PASSWORD,
    authInputDtoNewPasswordValidation,
    inputValidationResultMiddleware,
    rateLimitMiddleware.rateLimitMiddleware.bind(rateLimitMiddleware),
    authController.newPassword.bind(authController)
)