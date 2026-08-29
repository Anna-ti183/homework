import { Request, Response } from "express";
import { RegistrConfirmDTO } from "../../application/dtos/auth.attributes";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";

export async function registrConfirmHandler (
    req: Request<{}, {}, RegistrConfirmDTO>,
    res: Response
){
    try{
        const result = await authService.registrConfirmUser(req.body)

        if(result){
            res.status(HttpStatus.NoContent).send()
        }else{
            res.status(HttpStatus.BadRequest).send()
        }
    }catch (e: unknown){
        errorsHandler(e, res);
    }
}