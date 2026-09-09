//test.seeder.ts — нужен для того, чтобы быстро 
// подготавливать пользователей в базе данных перед интеграционными тестами.

import { randomUUID } from "crypto";
import { userCollection } from "../../src/db/collections"

//какие данные нужны, чтобы создать тестового пользователя
type RegisterUserPayloadType = {
    login: string,
    password: string,
    email: string,
    code?: string,
    expirationDate?: Date,
    isConfirmed?: boolean
}
export type RegisterUserResultType = {
    id: string,
    login: string,
    email: string,
    password: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}

export const testSeeder = {
    createUserDto() { //возвращает готового тестового пользователя.
        return {
            login: 'testing',
            email: 'test@mail.com',
            password: '12345678'
        }
    },

    async insertUser(
        {
            login,
            password,
            email,
            code,
            expirationDate,
            isConfirmed
        }: RegisterUserPayloadType
    ): Promise<RegisterUserResultType> {
        const newUser = {
            login,
            email,
            password,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: code ?? randomUUID(), //?? - если слева null или undefined, возьми значение справа
                expirationDate: expirationDate ?? new Date(Date.now() + 90 * 60 * 1000),
                isConfirmed: isConfirmed ?? false
            }
        };

        //сохраняем пользователя в MongoDB
        const res = await userCollection.insertOne({ ...newUser }) //insertOne - Возьми newUser и положи его в коллекцию пользователей
        return { //ерни мне ID созданного пользователя + все данные этого пользователя
            id: res.insertedId.toString(),
            ...newUser
        }
    }
}
