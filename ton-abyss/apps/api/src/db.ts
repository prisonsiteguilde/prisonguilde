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
    CREATE TABLE IF NOT EXISTS clans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      tag TEXT NOT NULL,
      motto TEXT,
      leader_char_id TEXT NOT NULL,
      treasury_gold INTEGER NOT NULL DEFAULT 0,
      rank INTEGER NOT NULL DEFAULT 1,
      xp INTEGER NOT NULL DEFAULT 0,
      perks TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS clan_members (
      clan_id TEXT NOT NULL REFERENCES clans(id) ON DELETE CASCADE,
      char_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'recruit',
      contribution INTEGER NOT NULL DEFAULT 0,
      joined_at INTEGER NOT NULL,
      last_donation_at INTEGER,
      PRIMARY KEY (clan_id, char_id)
    );
    CREATE TABLE IF NOT EXISTS arena_snapshots (
      char_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      class_id TEXT NOT NULL,
      level INTEGER NOT NULL,
      elo INTEGER NOT NULL DEFAULT 1000,
      stats TEXT NOT NULL,
      equipment TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS arena_matches (
      id TEXT PRIMARY KEY,
      attacker_id TEXT NOT NULL,
      defender_id TEXT NOT NULL,
      result TEXT NOT NULL,
      elo_delta INTEGER NOT NULL,
      log TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS leaderboard (
      char_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      class_id TEXT NOT NULL,
      level INTEGER NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      tower_floor INTEGER NOT NULL DEFAULT 0,
      arena_elo INTEGER NOT NULL DEFAULT 1000,
      boss_kills INTEGER NOT NULL DEFAULT 0,
      deaths INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
    CREATE INDEX IF NOT EXISTS idx_leaderboard_tower ON leaderboard(tower_floor DESC);
    CREATE INDEX IF NOT EXISTS idx_leaderboard_elo ON leaderboard(arena_elo DESC);
    CREATE INDEX IF NOT EXISTS idx_clan_members_char ON clan_members(char_id);
  `);
}

export function nowMs(): number {
  return Date.now();
}
