import { body } from 'express-validator'
import { Request, Response, NextFunction } from 'express';

const loginOrEmailValidator = body('loginOrEmail')
.isString()
.withMessage('loginOrEmail should be string')
.trim()
.notEmpty()  // чтобы не прислали пустую строку

const passwordValidator = body('password')
.isString()
.withMessage('password should be string')
.trim()
.notEmpty()  // чтобы не прислали пустую строку

export const authInputDtoValidation = [
    loginOrEmailValidator,
    passwordValidator,
];