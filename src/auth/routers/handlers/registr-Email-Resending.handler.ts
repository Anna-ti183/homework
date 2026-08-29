import { Request, Response } from "express";
import { RegistrEmailResending } from "../../application/dtos/auth.attributes";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";

export async function registrEmailResendingHandler(
    req: Request<{}, {}, RegistrEmailResending>,
    res: Response
) {
    try {
        const result = await authService.registrEmailResending(req.body)

        if (result) {
            res.status(HttpStatus.NoContent).send()
        } else {
            res.status(HttpStatus.BadRequest).send()
        }
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}

