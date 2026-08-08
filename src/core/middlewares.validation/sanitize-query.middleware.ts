//Этот middleware решает проблему с преобразованием query-параметров в Express 5.

import { NextFunction, Request, Response } from 'express';
import { matchedData } from 'express-validator';

// В Express 5 req.query — иммутабельный getter, поэтому express-validator
// не может записать в него трансформированные значения (.toInt(), .default()),
// и в req.query остаются сырые строки. matchedData() достаёт уже приведённые
// значения из внутреннего хранилища валидатора.
//
// Этот middleware один раз перекладывает приведённую query обратно в req.query
// (через defineProperty — обычное присваивание запрещено getter'ом), чтобы
// хендлеры читали типизированную query напрямую, без matchedData в каждом хендлере.
// Ставится в цепочке ПОСЛЕ валидаторов и inputValidationResultMiddleware.
export function sanitizeQueryParams(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const sanitized = matchedData(req, {
    locations: ['query'],     // Только из query
    includeOptionals: true,   // Включает поля со значением undefined
  });


  Object.defineProperty(req, 'query', {
    // Сырые параметры (напр. search-термы без валидатора) сохраняем как есть,
    // а провалидированные (пагинация/сортировка) перекрываем приведёнными значениями.
    value: { ...req.query, ...sanitized },
    configurable: true,
    enumerable: true,
    writable: false,
  });

  next();
}