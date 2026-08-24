// Базовый путь модуля авторизации (задаётся при подключении роутера в setup-app).
export const AUTH_PATH = '/api/auth';

// Относительные под-маршруты внутри роутера ауторизации — чтобы не хардкодить строки.
export const AUTH_ROUTERS = {
    ROOT: '', // → /api/auth
    LOGIN: '/login',
    ME: '/me',
} as const; 