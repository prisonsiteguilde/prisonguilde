import type { FastifyInstance } from "fastify";
import { loadState, saveState } from "../state.js";
import { ITEMS } from "@ton-abyss/content";
import { ECONOMY } from "@ton-abyss/shared";
import { z } from "zod";

export async function registerShopRoutes(app: FastifyInstance): Promise<void> {
  app.post("/api/shop/sell", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "unauthorized" });
    const parsed = z.object({ uids: z.array(z.string()).min(1) }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.message });
    const state = loadState(req.user.id);
    if (!state) return reply.code(404).send({ error: "no character" });
    let gold = 0;
    for (const uid of parsed.data.uids) {
      const idx = state.inventory.findIndex((i) => i.uid === uid);
      if (idx === -1) continue;
      const it = state.inventory[idx]!;
      const base = ITEMS[it.baseId];
      if (!base) continue;
      gold += Math.round(base.sellValue * ECONOMY.SHOP_SELL_MULT);
      state.inventory.splice(idx, 1);
    }
    state.character.gold += gold;
    saveState(req.user.id, state);
    return { ok: true, gold };
  });
}
