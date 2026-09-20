import { ObjectId, WithId } from "mongodb";
import { IUserDB } from "../domain/users";
import { deviceSessionCollection, rateLimitCollection, userCollection } from "../../db/collections";
import { NotFoundException } from "../../core/exceptions/not-found.exception";
import { ratelimit } from "../../core/rate-limit/domain/rate-limit";
import { session } from "../../sessions/domain/sessions";
import { Session } from "node:inspector";

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
    async findByEmail(email: string): Promise<WithId<IUserDB> | null> {
        return userCollection.findOne({ email })
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
    async update(id: string): Promise<void> {
        await userCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set:  // $set - используется для обновления значения существующего поля или создания нового поля, если его еще нет
                    { "emailConfirmation.isConfirmed": true } //В MongoDB путь к вложенному полю записывается строкой
            })

    },

    //обновляем код подтверждения
    async updateCode(id: string, confirmationCode: string, expirationDate: Date): Promise<void> {

        console.log('UPDATE CODE', id, confirmationCode, expirationDate);

        await userCollection.updateOne(
            { _id: new ObjectId(id) }, //находит пользователя по id
            {
                $set:  // обновляет confirmationCode, expirationDate
                    { 'emailConfirmation.confirmationCode': confirmationCode, 'emailConfirmation.expirationDate': expirationDate },
            })
    },


    //RITELIMITCOLLECTION


    // (подсчёт запросов на API  за последние 10 секунд)
    async reqCount(IP: string, URL: string): Promise<number> {
        const tenSeconds = new Date(Date.now() - 10 * 1000); // вычисляем дату 10 с назад 
        const count = await rateLimitCollection.countDocuments({ // считаем документы через countDocuments
            IP,
            URL,
            date: { $gte: tenSeconds } // $gt - это >=
        })
        return count;
    },

    //сохраняем обращение/запрос к API
    async saveRequest(dto: ratelimit): Promise<void> {
        await rateLimitCollection.insertOne(dto)
    },


    // SESSION

    //создание новой сессии 

    async createSession(newSession: session): Promise<void> {
        await deviceSessionCollection.insertOne(newSession)
    },

    // поиск сессии по user_id и device_id 
    // (потому что юзер - 1 а девайсов может быть 3)
    async findBySession(user_id: string, device_id: string): Promise <session | null> {
        const session = await deviceSessionCollection.findOne({user_id, device_id})
        if(!session) return null;
        return session;
    },

    //обновляем сессию 
    async updateSession(user_id: string, device_id: string, iat: number, exp:number, lastActiveDate: Date): Promise <void> {
        await deviceSessionCollection.updateOne(
            {user_id, device_id}, //по чему ищем Session
            {
                $set:
                {'iat': iat, 'exp': exp, 'lastActiveDate': lastActiveDate} //что обновляем
            }
        )
    },

    //удаляем сессию 
    async deleteSession(user_id: string, device_id: string): Promise <void> {
        await deviceSessionCollection.deleteOne({user_id,device_id})
    },


    //SECURITYDEVICES 


    //получить все сессии
    async allSessions(user_id: string): Promise <session[]> { //session[] → TypeScript говорит, что это массив Session.
      const sessions =  await deviceSessionCollection.find({user_id}).toArray() //toArray() → превращаем результат find() в массив
      return sessions;
    },

    //удалить все сессии кроме текущей 
    // user_id равен переданному userId, а device_id не равен переданному deviceId.
    async deleteSecDevExpectCurrent(userId: string, deviceId: string): Promise<void> {

        await deviceSessionCollection.deleteMany(
            {  
                user_id: {$eq: userId}, //$eq - (равно) 
                device_id: {$ne: deviceId} //$ne (не равно)
            }
        ) 
    }, 

    //поиск сессии по deviceId
    async findByDeviceId(deviceId: string): Promise <session | null> {
        //ищем в БД Session по полю device_id
        const session = await deviceSessionCollection.findOne({device_id: deviceId})
        if(!session) return null;
        return session;
    },

    //удалить текущую сессию 
    async deleteOneSession(deviceId: string): Promise <void> {
        await deviceSessionCollection.deleteOne({device_id: deviceId})
    }






}
