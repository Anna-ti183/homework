// Единая точка обработки исключений для подхода "через throw" (модуль блогов).
// Превращает кастомные исключения в HTTP-ответ в формате JSON:API-ошибок.

import { Response } from 'express';
import { HttpStatus } from '../types/http-statuses';
import { NotFoundException } from './not-found.exception';

export function errorsHandler(error: unknown, res: Response): void {
   
  // 1. NotFoundException - 404
    if (error instanceof NotFoundException) {
        res.status(HttpStatus.NotFound).send({
            errorsMessages: [{ message: error.message, field: '' }]
        });
        return;
    }

    // 2. Все остальные ошибки - 500
    console.error('Unhandled error:', error);
    res.status(HttpStatus.InternalServerError).send({
        errorsMessages: [{ message: 'Internal server error', field: '' }]
    });
}