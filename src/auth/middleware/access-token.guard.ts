//Защита токена доступа

import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { jwtService } from '../adapters/jwt.service';


export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {


    if (!req.headers.authorization) {  //Проверяем: есть ли у запроса заголовок:
        return res.sendStatus(HttpStatus.Unauthorized);
    };

    const [authType, token] = req.headers.authorization.split(' '); //Разделяем строку по пробелу.

    if (authType !== 'Bearer') { //Проверяем, действительно ли используется схема авторизации Bearer
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const payload = await jwtService.verifyToken(token); //Передаём сам JWT в твой jwtService.правильный ли секрет;действительный ли токен;не истёк ли он.

    if (payload) { //Если payload существует, значит JWT успешно проверен.
        const { userId } = payload; //Достаём userId из payload.

        req.userId = userId; //Вот здесь мы прикрепляем ID текущего пользователя к запросу.
        next(); //Всё нормально, пользователь авторизован. Передавай запрос дальше.

        return;
    }
    res.sendStatus(HttpStatus.Unauthorized);

    return;

}