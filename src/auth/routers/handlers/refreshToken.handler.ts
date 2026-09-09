import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../application/auth.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";

export async function refreshTokenHandler(
    req: Request,
    res: Response
){
    try{
        const oldRefreshToken = req.cookies.refreshToken //достаем старый токен из cookie
        if(!oldRefreshToken){
         return res.status(HttpStatus.Unauthorized).send()
        }; 

        //token = новая пара токенов ИЛИ null 
        const token = await authService.refreshTokens(oldRefreshToken);

        if(token === null){ //если refresh token недействителен или уже в blacklist.
            return res.status(HttpStatus.Unauthorized).send()
        };

        //достаём из token новые accessToken и  refreshToken
        const accessToken = token.accessToken;
        const refreshToken = token.refreshToken;

        //новый refreshToken нужно положить обратно в cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, })
        res.status(HttpStatus.Ok).send({accessToken})

       } catch (e: unknown) {
           errorsHandler(e, res);
       }
}