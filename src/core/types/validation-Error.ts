//Это тип для ошибок

export type ValidationErrorType = {
  field: string;
  message: string;
};

export type ValidationErrorDto = { errorsMessages: ValidationErrorType[] };