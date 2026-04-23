import type { FastifyInstance } from "fastify";
import { loadState, saveState } from "../state.js";
import { runDungeon } from "../engine/dungeon.js";
import { DUNGEONS } from "@ton-abyss/content";
import { z } from "zod";

export async function registerDungeonRoutes(app: FastifyInstance): Promise<void> {
  app.post("/api/dungeon/run", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "unauthorized" });
    const parsed = z.object({ dungeonId: z.string() }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.message });
    const state = loadState(req.user.id);
    if (!state) return reply.code(404).send({ error: "no character" });
    const dungeon = DUNGEONS[parsed.data.dungeonId];
    if (!dungeon) return reply.code(404).send({ error: "no dungeon" });
    const result = runDungeon(state, dungeon);
    saveState(req.user.id, result.state);
    return { ok: true, log: result.log, summary: result.summary };
  });

  app.get("/api/dungeons", async () => {
    return { dungeons: Object.values(DUNGEONS) };
  });
}
