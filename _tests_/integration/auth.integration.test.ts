/*import { MongoMemoryServer } from "mongodb-memory-server";
import { runDB } from "../../src/db";

describe('AUTH-INTEGRATION', () => {
    beforeAll(async () => { //Сделай это один раз перед всеми тестами внутри этого describe
        const mongoServer = await MongoMemoryServer.create(); //создаёт временную MongoDB в памяти специально для тестов.
        await runDB(mongoServer.getUri());
    });

    // Один раз после всех тестов 
    afterAll(async () => {
        await stopDb();
        await mongoServer.stop();
    });
})*/