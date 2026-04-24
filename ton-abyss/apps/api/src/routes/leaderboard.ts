import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db, nowMs } from "../db.js";

const UpdateSchema = z.object({
  charId: z.string(),
  name: z.string(),
  classId: z.string(),
  level: z.number().int().min(1),
  score: z.number().int().min(0),
  towerFloor: z.number().int().min(0).optional(),
  arenaElo: z.number().int().min(0).optional(),
  bossKills: z.number().int().min(0).optional(),
  deaths: z.number().int().min(0).optional(),
});

export async function registerLeaderboardRoutes(app: FastifyInstance): Promise<void> {
  app.post("/api/leaderboard/update", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "unauthorized" });
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad body" });
    const d = parsed.data;
    db.prepare(`
      INSERT INTO leaderboard (char_id, name, class_id, level, score, tower_floor, arena_elo, boss_kills, deaths, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(char_id) DO UPDATE SET
        name = excluded.name,
        class_id = excluded.class_id,
        level = MAX(level, excluded.level),
        score = MAX(score, excluded.score),
        tower_floor = MAX(tower_floor, excluded.tower_floor),
        arena_elo = excluded.arena_elo,
        boss_kills = MAX(boss_kills, excluded.boss_kills),
        deaths = excluded.deaths,
        updated_at = excluded.updated_at
    `).run(
      d.charId, d.name, d.classId, d.level, d.score,
      d.towerFloor ?? 0, d.arenaElo ?? 1000, d.bossKills ?? 0, d.deaths ?? 0,
      nowMs(),
    );
    return { ok: true };
  });

  app.get("/api/leaderboard/top", async (req) => {
    const q = req.query as { kind?: string; limit?: string };
    const kind = q.kind ?? "score";
    const limit = Math.min(100, parseInt(q.limit ?? "50", 10));
    const orderBy =
      kind === "tower" ? "tower_floor DESC" :
      kind === "arena" ? "arena_elo DESC" :
      kind === "bosses" ? "boss_kills DESC" :
      kind === "level" ? "level DESC" :
      "score DESC";
    const rows = db.prepare(`
      SELECT char_id, name, class_id, level, score, tower_floor, arena_elo, boss_kills, deaths
      FROM leaderboard ORDER BY ${orderBy} LIMIT ?
    `).all(limit);
    return { kind, rows };
  });
}
