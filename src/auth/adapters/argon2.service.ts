import argon2 from "argon2";

export const argon2Service = {
    async generateHash(password: string) {
        return argon2.hash(password);
    },

    async checkPassword(password: string, hash: string) {
        return argon2.verify(hash, password); //проверка введённого пароля против хеша, который уже хранится в базе
    },
};