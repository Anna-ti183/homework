// Ресурс не найден. Используется в подходе через throw :
// репозиторий/сервис кидают её, errorsHandler превращает в 404.
export class NotFoundException extends Error {}