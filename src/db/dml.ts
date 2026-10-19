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
}

export async function getAudio(
  db: SQLiteDatabase,
  userId: string,
): Promise<RawAudio[]> {
  const result: RawAudioDB[] = await db.getAllAsync(
    `SELECT * FROM songs WHERE user_id = ?`,
    [userId],
  );
  return result.map((file) => {
    return {
      id: file.id,
      title: file.title,
      audioPath: file.audio_path,
      type: file.type as RawAudioType,
    } as RawAudio;
  });
  // TODO finish this object
}
