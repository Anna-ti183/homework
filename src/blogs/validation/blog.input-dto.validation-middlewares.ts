//Валидация 

import { body } from 'express-validator'


const nameValidator = body('name')
  .isString() //Проверяет, что значение является строкой
  .withMessage('Name should be string')    //сообщение об ошибке
  .trim()         // Удаляет пробелы в начале и конце строки.
  .isLength({ min: 1, max: 15 })    //проверка длины
  .withMessage('The maximum name length is 15');

const descriptionValidator = body('description')
  .isString()
  .withMessage('description should be string')
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('The maximum description length is 500')

const websiteUrlValidator = body('websiteUrl')
  .isString()
  .withMessage('websiteUrl should be string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('The maximum websiteUrl length is 100')
  .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  .withMessage('websiteUrl should be string')

const titleValidation = body('title')
  .isString()
  .withMessage('title should be string')
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage('The maximum title length is 30');

const shortDescriptionValidation = body('shortDescription')
  .isString()
  .withMessage('shortDescription should be string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('The maximum shortDescription length is 100');

const contentValidation = body('content')
  .isString()
  .withMessage('content should be string')
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage('The maximum content length is 1000');



// Набор middleware-валидаторов тела запроса на создание/обновление водителя.
export const blogInputDtoValidation = [
  nameValidator,
  descriptionValidator,
  websiteUrlValidator
];

//// Набор middleware-валидаторов тела запроса для создания поста через блог
export const blogPostInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
];