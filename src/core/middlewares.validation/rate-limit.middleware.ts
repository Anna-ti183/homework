// промежуточный слой (middleware), 
// который будет считать количество документов по фильтру (IP, URL, date >= текущей даты - 10 сек).

import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../types/http-statuses';
import { inject, injectable } from 'inversify';
import { UsersRepository } from '../../users/repositories/users.repository';

@injectable()
export class RateLimitMiddleware {
   constructor(@inject(UsersRepository) protected usersRepository: UsersRepository){}

async rateLimitMiddleware(req: Request,res: Response, next: NextFunction)  {
   //достаем из REQ
   const IP = req.ip;
   const URL = req.originalUrl; //originalUrl → «куда конкретно пришёл запрос?»
   const date = new Date();

   //подчитываем сколько было запросов за последние 10 секунд
   const count = await this.usersRepository.reqCount(IP!, URL)

   if (count >= 5) {
      res.status(HttpStatus.TooManyRequests).send('Too many requests')
      return;
   }
   //создаем объект для сохранения в БД
   const rateLimit = {
      IP: IP!,
      URL,
      date,
   };

   await this.usersRepository.saveRequest(rateLimit)

   next();
}
}
