import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db, nowMs } from "../db.js";

interface SnapshotRow {
  char_id: string;
  name: string;
  class_id: string;
  level: number;
  elo: number;
  stats: string;
  equipment: string;
  updated_at: number;
}

function eloDelta(attackerElo: number, defenderElo: number, attackerWon: boolean): number {
  const k = 24;
  const expected = 1 / (1 + Math.pow(10, (defenderElo - attackerElo) / 400));
  const score = attackerWon ? 1 : 0;
  return Math.round(k * (score - expected));
}

export async function registerArenaRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", async (req, reply) => {
    if (!req.url.startsWith("/api/arena")) return;
    if (!req.user) reply.code(401).send({ error: "unauthorized" });
  });

  // Upload a snapshot of player to be fought against by others.
  const UploadSchema = z.object({
    charId: z.string(),
    name: z.string(),
    classId: z.string(),
    level: z.number().int().min(1),
    stats: z.record(z.number()),
    equipment: z.record(z.any()).optional(),
  });

  app.post("/api/arena/snapshot", async (req, reply) => {
    const parsed = UploadSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad body", details: parsed.error.flatten() });
    const { charId, name, classId, level, stats, equipment } = parsed.data;
    const existing = db.prepare("SELECT elo FROM arena_snapshots WHERE char_id = ?").get(charId) as { elo: number } | undefined;
    const elo = existing?.elo ?? 1000;
    db.prepare(`
      INSERT INTO arena_snapshots (char_id, name, class_id, level, elo, stats, equipment, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(char_id) DO UPDATE SET
        name = excluded.name,
        class_id = excluded.class_id,
        level = excluded.level,
        stats = excluded.stats,
        equipment = excluded.equipment,
        updated_at = excluded.updated_at
    `).run(charId, name, classId, level, elo, JSON.stringify(stats), JSON.stringify(equipment ?? {}), nowMs());
    return { ok: true, elo };
  });

  // Get list of opponents based on ELO.
  app.get("/api/arena/opponents", async (req, reply) => {
    const q = req.query as { charId?: string };
    if (!q.charId) return reply.code(400).send({ error: "missing charId" });
    const self = db.prepare("SELECT elo, level FROM arena_snapshots WHERE char_id = ?").get(q.charId) as { elo: number; level: number } | undefined;
    const myElo = self?.elo ?? 1000;
    const rows = db.prepare(`
      SELECT char_id, name, class_id, level, elo, stats, equipment
      FROM arena_snapshots
      WHERE char_id != ? AND ABS(elo - ?) < 300
      ORDER BY ABS(elo - ?) ASC
      LIMIT 10
    `).all(q.charId, myElo, myElo) as SnapshotRow[];
    return {
      myElo,
      opponents: rows.map((r) => ({
        charId: r.char_id,
        name: r.name,
        classId: r.class_id,
        level: r.level,
        elo: r.elo,
        stats: JSON.parse(r.stats),
        equipment: JSON.parse(r.equipment),
      })),
    };
  });

  // Resolve a duel server-side using submitted rng seed & deterministic log.
  const DuelSchema = z.object({
    attackerCharId: z.string(),
    defenderCharId: z.string(),
    attackerWon: z.boolean(),
    log: z.array(z.any()),
  });

  app.post("/api/arena/duel", async (req, reply) => {
    const parsed = DuelSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad body" });
    const { attackerCharId, defenderCharId, attackerWon, log } = parsed.data;
    const att = db.prepare("SELECT elo FROM arena_snapshots WHERE char_id = ?").get(attackerCharId) as { elo: number } | undefined;
    const def = db.prepare("SELECT elo FROM arena_snapshots WHERE char_id = ?").get(defenderCharId) as { elo: number } | undefined;
    if (!att || !def) return reply.code(404).send({ error: "snapshot missing" });
    const delta = eloDelta(att.elo, def.elo, attackerWon);
    const newAttElo = Math.max(0, att.elo + delta);
    const newDefElo = Math.max(0, def.elo - delta);
    db.prepare("UPDATE arena_snapshots SET elo = ? WHERE char_id = ?").run(newAttElo, attackerCharId);
    db.prepare("UPDATE arena_snapshots SET elo = ? WHERE char_id = ?").run(newDefElo, defenderCharId);
    const matchId = `am_${Math.random().toString(36).slice(2, 10)}`;
    db.prepare(`
      INSERT INTO arena_matches (id, attacker_id, defender_id, result, elo_delta, log, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(matchId, attackerCharId, defenderCharId, attackerWon ? "win" : "loss", delta, JSON.stringify(log), nowMs());
    return { ok: true, matchId, newElo: newAttElo, delta };
  });

  app.get("/api/arena/top", async () => {
    const rows = db.prepare(`
      SELECT char_id, name, class_id, level, elo FROM arena_snapshots ORDER BY elo DESC LIMIT 50
    `).all();
    return { top: rows };
  });
}
