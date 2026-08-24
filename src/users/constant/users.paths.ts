// Базовый путь модуля пользователя (задаётся при подключении роутера в setup-app).
export const USERS_PATH = '/api/users';

// Относительные под-маршруты внутри роутера пользователя — чтобы не хардкодить строки.
export const USERS_ROUTERS = {
    ROOT: '',
    BY_ID: '/:id',
} as const; 