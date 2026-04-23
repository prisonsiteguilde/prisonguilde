import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.DB_PATH ?? "./data/abyss.db";

export let db: Database.Database;

export function initDb(): void {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      tg_id INTEGER UNIQUE,
      username TEXT,
      created_at INTEGER NOT NULL,
      ton_address TEXT
    );
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS inventory (
      char_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      uid TEXT NOT NULL,
      base_id TEXT NOT NULL,
      data TEXT NOT NULL,
      PRIMARY KEY (char_id, uid)
    );
    CREATE TABLE IF NOT EXISTS materials (
      char_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      base_id TEXT NOT NULL,
      qty INTEGER NOT NULL,
      PRIMARY KEY (char_id, base_id)
    );
    CREATE TABLE IF NOT EXISTS pets (
      char_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      uid TEXT NOT NULL,
      data TEXT NOT NULL,
      PRIMARY KEY (char_id, uid)
    );
    CREATE TABLE IF NOT EXISTS dungeon_runs (
      id TEXT PRIMARY KEY,
      char_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      dungeon_id TEXT NOT NULL,
      state TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      finished_at INTEGER
    );
  `);
}

export function nowMs(): number {
  return Date.now();
}
