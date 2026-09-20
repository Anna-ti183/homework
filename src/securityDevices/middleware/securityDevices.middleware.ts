// провемжуточный слой (middleware)
//Убедиться, что refreshToken действительно принадлежит существующей активной Session, и определить текущего пользователя.

import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../../auth/adapters/jwt.service';
import { HttpStatus } from '../../core/types/http-statuses';
import { usersRepository } from '../../users/repositories/users.repository';

export async function securDevicesRefTokenMiddleware (
    req: Request,
    res: Response,
    next: NextFunction
){
    //Взять refreshToken из cookie.
    const refToken = req.cookies.refreshToken;
    if(!refToken) return res.status(HttpStatus.Unauthorized).send();

    //Проверить refreshToken через jwtService.
    const payloadRefreshToken = await jwtService.verifyToken(refToken)
    if(!payloadRefreshToken) return res.status(HttpStatus.Unauthorized).send();

    //Достать из payload:
    const userId = payloadRefreshToken.userId;
    const deviceId = payloadRefreshToken.deviceId;
    const iat = payloadRefreshToken.iat;

    //Найти соответствующую Session по userId + deviceId.
    const session = await usersRepository.findBySession(userId,deviceId)
    if(!session) return res.status(HttpStatus.Unauthorized).send();

    //Сравнить iat из JWT с iat из Session.
    const iatSession = session.iat
    if(iat !== iatSession) return res.status(HttpStatus.Unauthorized).send();

    //Если всё прошло успешно:
    req.userId = userId;
    req.deviceId = deviceId;

    next();

}