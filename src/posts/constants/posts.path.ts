// Базовый путь модуля поста (задаётся при подключении роутера в setup-app).
export const POSTS_PATH = '/api/posts';

// Относительные под-маршруты внутри роутера блога — чтобы не хардкодить строки
export const POSTS_ROUTERS = {
    ROOT: '',
    BY_ID: '/:id',
    COMMENTS: '/:postId/comments',
} as const;