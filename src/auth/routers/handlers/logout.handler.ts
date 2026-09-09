import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../application/auth.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";

export async function logoutHandler(
    req: Request,
    res: Response
) {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        if (!oldRefreshToken) return res.status(HttpStatus.Unauthorized).send()


        const oldToken = await authService.logout(oldRefreshToken)

        if (oldToken === true) return res.status(HttpStatus.NoContent).send()

        if (oldToken === false) return res.status(HttpStatus.Unauthorized).send()

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
} 