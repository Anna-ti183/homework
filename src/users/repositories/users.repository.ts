import { ObjectId, WithId } from "mongodb";
import { IUserDB } from "../domain/users";
import { userCollection } from "../../db/collections";
import { NotFoundException } from "../../core/exceptions/not-found.exception";

export const usersRepository = {

    // ✅ Метод для проверки логина и email одним запросом
    async findByLoginOrEmail(login: string, email: string): Promise<WithId<IUserDB> | null> {
        return await userCollection.findOne({
            $or: [
                { login: login },
                { email: email }
            ]
        });
    },


    //Найти пользователя  по ID
    async findById(id: string): Promise<WithId<IUserDB> | null> {
        return userCollection.findOne({ _id: new ObjectId(id) });
    },

    //Найти пользователя по code
    async findByCode(code: string): Promise<WithId<IUserDB> | null> {
        return userCollection.findOne({ 'emailConfirmation.confirmationCode': code }) //"emailConfirmation.confirmationCode" — где ищем; code — что ищем.
    },

    //Найти пользователя по email
    async findByEmail(email: string): Promise<WithId<IUserDB> | null>{
        return userCollection.findOne({email})
    },

    //Сохранить нового пользователя  в БД
    async create(newUser: IUserDB): Promise<string> { //newUser: User — принимает объект юзера (с уже добавленными createdAt)

    
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

    //обновить isConfirmed из false  на true (Найди пользователя с этим _id → поставь emailConfirmation.isConfirmed в true.)
    async update(id: string ): Promise<void> {
        await userCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set:  // $set - используется для обновления значения существующего поля или создания нового поля, если его еще нет
                    { "emailConfirmation.isConfirmed": true } //В MongoDB путь к вложенному полю записывается строкой
            }) 

    },

    //обновляем код подтверждения
    async updateCode(id:string, confirmationCode: string, expirationDate: Date): Promise <void> {

        console.log('UPDATE CODE', id, confirmationCode, expirationDate);
        
        await userCollection.updateOne(
            {_id: new ObjectId(id) }, //находит пользователя по id
            {
                $set:  // обновляет confirmationCode, expirationDate
                {'emailConfirmation.confirmationCode': confirmationCode, 'emailConfirmation.expirationDate': expirationDate},
            })
    }
}