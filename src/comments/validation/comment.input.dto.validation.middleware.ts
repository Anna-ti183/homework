import { body } from 'express-validator'

const contentValidator = body('content')
.isString()
.withMessage('comment should be string')
.trim()
.isLength({min: 20, max: 300})
.withMessage('The minimum length comment is 20 and the maximum is 300')

export const commentInputDtoValidation = [
    contentValidator
]