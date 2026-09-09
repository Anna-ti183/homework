//пульт управления базой данных для тестов.
import { Db, MongoClient } from "mongodb";
import { initCollections } from "./db/collections";
import { SETTINGS } from "./settings/config";

export const db = {
    client: {} as MongoClient,

    // Получаем нашу базу данных
    getDbName(): Db {
        return this.client.db(SETTINGS.DB_NAME);
    },

    // Подключаемся к MongoDB
    async run(url: string) { 
        try {
            this.client = new MongoClient(url); //Создаём клиента.

            await this.client.connect(); //Подключаемся.

            await this.getDbName().command({ ping: 1 }); //проверяет - Если всё хорошо: Connected successfully to mongo server

            initCollections(this.getDbName());

            console.log("Connected successfully to mongo server");
        } catch (e: unknown) {
            console.error("Can't connect to mongo server", e);
            await this.client.close();
        }
    },

    async stop() { //Закрывает соединение с MongoDB.
        await this.client.close();

        console.log("Connection successfully closed");
    },

    async drop() { //очищает данные из всех коллекций
        try {
            const collections = await this.getDbName()
                .listCollections()
                .toArray();

            for (const collection of collections) {
                const collectionName = collection.name;

                await this.getDbName()
                    .collection(collectionName)
                    .deleteMany({});
            }
        } catch (e: unknown) {
            console.error("Error in drop db:", e);

            await this.stop();
        }
    },

};
