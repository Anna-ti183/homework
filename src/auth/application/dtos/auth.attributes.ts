//DTO для входа login

export type AuthAttributes = {
    loginOrEmail: string;
    password: string;
}

//DTO для входа registration
export type RegistrDTO = {
    login: string;
    password: string;
    email: string;
}

//DTO для входа registration-confirmation
export type RegistrConfirmDTO = {
    code: string;
}

// DTO для поторной отправки письма подтверждения
export type RegistrEmailResending = {
    email: string;
}