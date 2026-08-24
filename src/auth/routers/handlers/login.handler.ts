import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { AuthAttributes } from "../../application/dtos/auth.attributes";


export async function loginHandler(
    req: Request<{},{}, AuthAttributes>,
    res: Response,
) {

    try{
        // 1. Вызываем сервис для логина
        const accessToken = await authService.loginUser(req.body);

        // 2. Если accessToken есть возвращаем статус 200 и сам токен
        if(accessToken){
            res.status(HttpStatus.Ok).send({ accessToken })
        } else {
            res.status(HttpStatus.Unauthorized).send()
        }

    }  catch (e: unknown) {
            errorsHandler(e,res);
        }
}