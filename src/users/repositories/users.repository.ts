import { ObjectId, WithId } from "mongodb";
import { User } from "../domain/users";
import { userCollection } from "../../db/collections";
import { NotFoundException } from "../../core/exceptions/not-found.exception";

export const usersRepository = {

    // ✅ Метод для проверки логина и email одним запросом
    async findByLoginOrEmail(login: string, email:string): Promise<WithId<User> | null> {
        return await userCollection.findOne({
            $or: [
                {login: login},
                {email: email}
            ]
        });
    },


    //Найти пользователя  по ID
    async findById(id: string): Promise<WithId<User> | null> {
        return userCollection.findOne({ _id: new ObjectId(id) });
    },

    //Сохранить нового пользователя  в БД
    async create(newUser: User): Promise<string> { //newUser: User — принимает объект юзера (с уже добавленными createdAt)
        const insertResult = await userCollection.insertOne(newUser); //Вставляет новый документ в коллекцию MongoDB

        return insertResult.insertedId.toString() //Содержит сгенерированный MongoDB ObjectId, который преобразует в строку 
    },

    // Удалить пользователя 
    async delete(id: string): Promise<void> {

        if (!ObjectId.isValid(id)) { // проверка на валидность 
            throw new NotFoundException('User not found');
        }

        const deletedResult = await userCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deletedResult.deletedCount < 1) {
            throw new NotFoundException('User not found');
        }

        return;
    },
}