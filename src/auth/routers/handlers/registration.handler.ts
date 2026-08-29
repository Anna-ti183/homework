import { Request, Response } from "express";
import { RegistrDTO } from "../../application/dtos/auth.attributes";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";

export async function registrationHandler(
    req: Request<{}, {}, RegistrDTO>,
    res: Response
) {
    try {
        const result = await authService.registrUser(req.body)

        if (result) {
            res.status(HttpStatus.NoContent).send()
        } else {
            res.status(HttpStatus.BadRequest).send()
        }

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}