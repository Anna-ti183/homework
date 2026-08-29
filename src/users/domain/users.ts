//User — это общая доменная модель, которая описывает, как выглядит пользователь ВО ВСЁМ приложении.

export type IUserDB = {
    login: string;
    email: string;
    password: string; // ← обязательно!
    createdAt: string;

    emailConfirmation: { // доп поля необходимые для подтверждения
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean //подтверждение 
                }
}