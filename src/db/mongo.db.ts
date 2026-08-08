import { MongoClient, Db } from "mongodb";
import { SETTINGS } from "../settings/config";
import { initCollections } from "./collections";


export let client: MongoClient;



// Подключение к БД
export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    // Инициализируем коллекции из подключённой базы.
initCollections(db);

try{
  await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

// для тестов
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}