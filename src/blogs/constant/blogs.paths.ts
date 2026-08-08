// Базовый путь модуля блога (задаётся при подключении роутера в setup-app).
export const BLOGS_PATH = '/api/blogs';

// Относительные под-маршруты внутри роутера блога — чтобы не хардкодить строки.
export const BLOGS_ROUTERS = {
    ROOT: '',
    BY_ID: '/:id',
    POSTS: '/:id/posts'
} as const; 