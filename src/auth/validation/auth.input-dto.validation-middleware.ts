import { body } from 'express-validator'
import { Request, Response, NextFunction } from 'express';

//login
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

// регистрация
const loginRegistrationValidator = body('login')
.isString()
.withMessage('Login should be string')
.trim()
.isLength({min: 3, max: 10})
.withMessage('The min length login is 3 and the max is 10')
.matches(/^[a-zA-Z0-9_-]*$/)
.withMessage('login contains invalid characters')

const passwordRegistrationValidator = body('password')
.isString()
.withMessage('Password should be string')
.trim()
.isLength({min: 6, max: 20})
.withMessage('The min length password is 6 and the max is 20')

const emailRegistrationValidator = body ('email')
.isString()
.withMessage('Email should be string')
.trim()
.notEmpty()
.withMessage('The email must not be an empty string')
.matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
.withMessage('email contains invalid characters')

export const authInputDtoRegistrationValidation = [
    loginRegistrationValidator,
    passwordRegistrationValidator,
    emailRegistrationValidator
];

//confirmation - подтверждение 
const codeValidator = body ('code')
.isString()
.withMessage('code should be string')
.trim()
.notEmpty()
.withMessage('The code must not be an empty string')

export const authInputDtoRegistrConfirmValidator = [
    codeValidator,
];

//registration-email-resending
export const authInputDtoRegistrEmailResendingValidation = [
    emailRegistrationValidator,
]
