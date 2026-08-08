import { NextFunction, Request, Response} from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../settings/config";


export const superAdminGuardMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const auth = req.headers['authorization'] as string; // 'Basic xxxx'

    if(!auth){
        res.sendStatus(HttpStatus.Unauthorized);
        return;
    }

    const [authType, token] = auth.split(' ') // authType — тип авторизации (например, "Basic") /// token — сам токен (закодированные данные /// auth.split(' ') — разбивает строку auth на массив по пробелу

    if(authType !== 'Basic') {
       res.sendStatus(HttpStatus.Unauthorized); 
       return;
    }

  // Декодируем base64 и разбираем на логин и пароль.
  const credentials = Buffer.from(token, 'base64').toString('utf-8'); // Buffer.from() создает буфер (бинарные данные) из строки token /// Второй аргумент 'base64' указывает, что строка закодирована в base64  /// .toString('utf-8')Декодирует бинарные данные в обычную строку в кодировке UTF-8
  const [username, password] = credentials.split(':') /// Деструктуризация массива: первый элемент → username, второй → password /// credentials.split(':') — разбивает строку по двоеточию :

  if( username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized); 
    return;
  }

  next();
}