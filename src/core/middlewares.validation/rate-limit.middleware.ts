// промежуточный слой (middleware), 
// который будет считать количество документов по фильтру (IP, URL, date >= текущей даты - 10 сек).

import { NextFunction, Request, Response } from 'express';
import { usersRepository } from '../../users/repositories/users.repository'
import { HttpStatus } from '../types/http-statuses';

export async function rateLimitMiddleware (
  req: Request,
  res: Response,
  next: NextFunction,
) {
 //достаем из REQ
 const IP = req.ip;
 const URL = req.originalUrl; //originalUrl → «куда конкретно пришёл запрос?»
 const date = new Date(); 

 //подчитываем сколько было запросов за последние 10 секунд
 const count = await usersRepository.reqCount(IP!,URL)

 if(count >= 5){ 
    res.status(HttpStatus.TooManyRequests).send('Too many requests')
    return;
 }
 //создаем объект для сохранения в БД
 const rateLimit = {
    IP: IP!,
    URL,
    date,
 };

 await usersRepository.saveRequest(rateLimit)

next();
}