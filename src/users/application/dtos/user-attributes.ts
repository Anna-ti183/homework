/*Что делает:
Определяет структуру тела запроса для POST / users 
Используется в сервисе для типизации входных данных
Отделяет "что приходит от клиента" от "как хранится в БД"
 * Разница с доменной моделью User:
 * - UserAttributes: { login, email, password } - что приходит от клиента
 * - User: { login, email, password (hashed), createdAt } - что хранится в БД
 */

export type UserAttributes ={
    login: string;
    password: string;
    email: string;
}