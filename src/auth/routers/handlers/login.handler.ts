import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { AuthAttributes } from "../../application/dtos/auth.attributes";


export async function loginHandler(
    req: Request<{}, {}, AuthAttributes>,
    res: Response,
) {

    try {
       const ip = req.ip;  //IP
        const deviceName = req.headers['user-agent'] || 'Unknown device'; //deviceName
       
        // 1. Вызываем сервис для логина
        const tokens = await authService.loginUser(req.body, ip!,deviceName);

        // 2. Если accessToken есть возвращаем статус 200 и сам токен
        if (tokens) {
            const accessToken = tokens.accessToken
            const refreshToken = tokens.refreshToken

            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, })
            res.status(HttpStatus.Ok).send({ accessToken })

        } else {
            res.status(HttpStatus.Unauthorized).send()
        }

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}