import { body } from "express-validator"

const titleValidation = body('title')
.isString()
.withMessage('title should be string')
.trim()         
.isLength({ min: 1, max: 30})    
.withMessage('The maximum title length is 30');

const shortDescriptionValidation = body('shortDescription')
.isString()
.withMessage('shortDescription should be string')
.trim()        
.isLength({ min: 1, max: 100})    
.withMessage('The maximum shortDescription length is 100');

const contentValidation = body('content')
.isString()
.withMessage('content should be string')
.trim()        
.isLength({ min: 1, max: 1000})    
.withMessage('The maximum content length is 1000');

const blogIdValidation = body('blogId')
.isString()
.withMessage('blogId should be string')
.trim()        
.isLength({ min: 1})    
.withMessage('The minimum blogId length is 1');


export const postInputDtoValidator = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
]