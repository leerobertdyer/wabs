import { RawAudioDB } from "@/db/db_types";
import { RawAudio, RawAudioType } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";

export async function storeAudio(
  db: SQLiteDatabase,
  song: RawAudio,
  userId: string,
) {
  const now = new Date().getTime();
  const result = await db.runAsync(
    `INSERT INTO songs (
        id, user_id, title, type, audio_path, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [song.id, userId, song.title, song.type, song.audioPath, now, now],
  );
  console.log("storeAudio Result: ", result)
}

export async function getAudio(
    db: SQLiteDatabase,
    songId: string,
): Promise<RawAudio | null> {
    const result: RawAudioDB | null = await db.getFirstAsync(
        `SELECT * FROM songs WHERE id = ?`, [songId]
    )
    console.log("getAudio RESULT: ", result)
    if (!result) return null;
    return {
        id: result.id,
        title: result.title,
        audioPath: result.audio_path,
        type: result.type as RawAudioType
    } // TODO finish this object
}