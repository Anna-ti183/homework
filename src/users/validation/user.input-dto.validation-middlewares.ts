import { body } from 'express-validator'

const loginValidator = body('login')
.isString()
.withMessage('login should be string')
.trim()
.isLength({min: 3, max: 10})
.withMessage('The minimum length login is 3 and the maximum is 10')
.matches(/^[a-zA-Z0-9_-]*$/)
.withMessage('Login can only contain letters, numbers, underscore and hyphen');

const passwordValidator = body ('password')
.isString()
.withMessage('password should be string')
.trim()
.isLength({min: 6, max: 20})
.withMessage('The minimum length password is 6 and the maximum is 20');

const emailValidator = body ('email')
.isString()
.withMessage('email should be string')
.trim()
.matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
.withMessage('email must be a valid email address');

export const userInputDtoValidation = [
    loginValidator,
    passwordValidator,
    emailValidator,
];


