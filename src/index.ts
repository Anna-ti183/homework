import express from "express";
import { setupApp } from "./setup-app";
import { runDB } from './db/mongo.db';
import { SETTINGS } from "./settings/config";

const bootstap = async () => {
    const app = express();

    app.set('trust proxy', true); //Для получения корректного ip-адреса

    setupApp(app);
    const PORT = SETTINGS.PORT;

    await runDB(SETTINGS.MONGO_URL)


    // запуск приложения
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
    });

    return app;
};

bootstap();