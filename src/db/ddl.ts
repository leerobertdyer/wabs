export const MIGRATIONS: string[] = [
  `CREATE TABLE songs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  type TEXT,                          -- 'riff' | 'lyrics' | 'both'
  is_starred INTEGER NOT NULL DEFAULT 0,
  audio_path TEXT,                    -- local, relative; null if not on this device
  duration_ms INTEGER,
  lyrics TEXT,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'recorded',
  visibility TEXT NOT NULL DEFAULT 'private',
  uploaded_at INTEGER,                -- when audio was backed up; null = not yet
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);`,                                   // version 1
  // `ALTER TABLE songs ADD COLUMN ...;`  // version 2 goes here
];