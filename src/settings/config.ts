import type { StringValue } from "ms"; //TypeScript-тип, который описывает строки, обозначающие промежуток времени.

import { config } from "dotenv";

config();


const env = process.env;


export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'qwerty';

export const SETTINGS = {
    PORT: env.PORT || 5016,
    MONGO_URL: env.MONGO_URL || 'mongodb://localhost:27017/test',
    DB_NAME: env.DB_NAME || 'test',
    SECRET_KEY: env.SECRET_KEY as string,
    AC_TIME: env.AC_TIME as StringValue,
    EMAIL: process.env.EMAIL as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
};

