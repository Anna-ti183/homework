import { param } from 'express-validator';

export const idValidation = param('id')
  .exists()
  .withMessage('ID is required') // Проверка на наличие
  .isString()
  .withMessage('ID must be a string') // Проверка, что это строка
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');