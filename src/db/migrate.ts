import type { SQLiteDatabase } from "expo-sqlite";
import { MIGRATIONS } from "./ddl";

export const DB_NAME = "wabs.db";

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  for (let v = row?.user_version ?? 0; v < MIGRATIONS.length; v++) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[v]);
      await db.execAsync(`PRAGMA user_version = ${v + 1}`);
    });
  }
  
  if (__DEV__) {
    const v = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
    const user_id = await db.getFirstAsync<{ user_id: string }>("SELECT user_id FROM songs LIMIT 1")
    const t = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table'"
    );
    console.log("[db] version", v?.user_version, "tables", t.map((x) => x.name),"userId: ", user_id);
  }
}