
const env = process.env;


export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'qwerty';

export const SETTINGS = {
    PORT: env.PORT || 5016,
    MONGO_URL: env.MONGO_URL || 'mongodb://localhost:27017/test',
    DB_NAME: env.DB_NAME || 'test',
};