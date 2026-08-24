//User — это общая доменная модель, которая описывает, как выглядит пользователь ВО ВСЁМ приложении.

export type User = {
    login: string;
    email: string;
    password: string; // ← обязательно!
    createdAt: string;
}