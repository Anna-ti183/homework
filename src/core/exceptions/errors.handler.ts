// Единая точка обработки исключений для подхода "через throw" (модуль блогов).
// Превращает кастомные исключения в HTTP-ответ в формате JSON:API-ошибок.

import { Response } from 'express';
import { HttpStatus } from '../types/http-statuses';
import { NotFoundException } from './not-found.exception';
import { BadRequestException } from './bad-request.exception';
import { ForbiddenException } from './forbidden.exception';

export function errorsHandler(error: unknown, res: Response): void {
   
  // 1. NotFoundException - 404
    if (error instanceof NotFoundException) {
        res.status(HttpStatus.NotFound).send({
            errorsMessages: [{ message: error.message, field: '' }]
        });
        return;
    }

     // 2. BadRequestException → 400
    if (error instanceof BadRequestException) {
        res.status(HttpStatus.BadRequest).send({
            errorsMessages: error.errorsMessages,
        });
        return;
    }

    //3.ForbiddenException → 403
    if (error instanceof ForbiddenException) {
    res.status(HttpStatus.Forbidden).send({
        errorsMessages: [{ message: error.message, field: '' }]
    });
    return;
}

    // 4. Все остальные ошибки - 500
    console.error('Unhandled error:', error);
    res.status(HttpStatus.InternalServerError).send({
        errorsMessages: [{ message: 'Internal server error', field: '' }]
    });
}