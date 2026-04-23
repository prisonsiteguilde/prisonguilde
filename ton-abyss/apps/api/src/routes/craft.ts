import type { FastifyInstance } from "fastify";
import { loadState, saveState } from "../state.js";
import { RECIPES, ITEMS } from "@ton-abyss/content";
import { canCraft, craft, RNG, seedFrom, upgradeItem, SALVAGE_YIELD } from "@ton-abyss/shared";
import { z } from "zod";

export async function registerCraftRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/recipes", async () => ({ recipes: Object.values(RECIPES) }));

  app.post("/api/craft", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "unauthorized" });
    const parsed = z.object({ recipeId: z.string() }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.message });
    const state = loadState(req.user.id);
    if (!state) return reply.code(404).send({ error: "no character" });
    const recipe = RECIPES[parsed.data.recipeId];
    if (!recipe) return reply.code(404).send({ error: "no recipe" });
    if (!canCraft(recipe, state.materials, state.character.gold)) return reply.code(400).send({ error: "insufficient" });
    const base = ITEMS[recipe.outputBaseId];
    if (!base) return reply.code(500).send({ error: "bad recipe" });
    // Consume.
    state.character.gold -= recipe.goldCost;
    for (const inp of recipe.inputs) state.materials[inp.baseId] = (state.materials[inp.baseId] ?? 0) - inp.qty;
    const rng = new RNG(seedFrom(req.user.id, recipe.id, Date.now()));
    const item = craft(recipe, rng, base, { magicFindPct: state.character.stats.luck * 3 });
    state.inventory.push(item);
    saveState(req.user.id, state);
    return { ok: true, item };
  });

  app.post("/api/upgrade", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "unauthorized" });
    const parsed = z.object({ uid: z.string() }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.message });
    const state = loadState(req.user.id);
    if (!state) return reply.code(404).send({ error: "no character" });
    const idx = state.inventory.findIndex((i) => i.uid === parsed.data.uid);
    if (idx === -1) return reply.code(404).send({ error: "no item" });
    const item = state.inventory[idx]!;
    const next = item.upgradeLevel + 1;
    if (next > 15) return reply.code(400).send({ error: "max level" });
    const rng = new RNG(seedFrom(req.user.id, item.uid, Date.now()));
    const { UPGRADE_TABLE } = await import("@ton-abyss/shared");
    const row = UPGRADE_TABLE[next - 1]!;
    if (state.character.gold < row.goldCost || state.character.abyssDust < row.dustCost) {
      return reply.code(400).send({ error: "insufficient" });
    }
    state.character.gold -= row.goldCost;
    state.character.abyssDust -= row.dustCost;
    const result = upgradeItem(rng, item);
    if (result.result === "destroy") {
      state.inventory.splice(idx, 1);
    } else if (result.item) {
      state.inventory[idx] = result.item;
    }
    saveState(req.user.id, state);
    return { ok: true, result: result.result };
  });

  app.post("/api/salvage", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "unauthorized" });
    const parsed = z.object({ uids: z.array(z.string()).min(1) }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.message });
    const state = loadState(req.user.id);
    if (!state) return reply.code(404).send({ error: "no character" });
    let matsGained = 0;
    let dust = 0;
    let shards = 0;
    for (const uid of parsed.data.uids) {
      const idx = state.inventory.findIndex((i) => i.uid === uid);
      if (idx === -1) continue;
      const it = state.inventory[idx]!;
      const yieldTable = SALVAGE_YIELD[it.rarity];
      state.materials["mat_iron"] = (state.materials["mat_iron"] ?? 0) + yieldTable.materials;
      matsGained += yieldTable.materials;
      dust += yieldTable.dust;
      shards += yieldTable.shards;
      state.inventory.splice(idx, 1);
    }
    state.character.abyssDust += dust;
    state.character.shards += shards;
    saveState(req.user.id, state);
    return { ok: true, matsGained, dust, shards };
  });
}
