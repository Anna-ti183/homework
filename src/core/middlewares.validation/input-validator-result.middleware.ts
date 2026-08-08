// центральный middleware для обработки ошибок валидации - формат Plain JSON: { errorsMessages: [...] }.

import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from "express-validator";
import { ValidationErrorDto, ValidationErrorType } from '../types/validation-Error';
import { HttpStatus } from '../types/http-statuses';


export const createErrorMessages =(
    errors: ValidationErrorType[],
): ValidationErrorDto => {
  return { errorsMessages: errors };
};

// Приводит ошибку express-validator к нашему формату { field, message }.
// У ошибок типа 'field' (body/param — а других валидаторов у нас нет) есть путь к полю.
const formatErrors = (error: ValidationError): ValidationErrorType => {
  if (error.type === 'field') {
    return { field: error.path, message: error.msg };
  }

  // Прочие типы ошибок express-validator у нас не используются.
  return { field: '', message: error.msg };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
    return;
  }

  next();
};