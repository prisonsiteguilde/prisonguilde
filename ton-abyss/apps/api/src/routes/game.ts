import type { FastifyInstance } from "fastify";
import { loadState, saveState } from "../state.js";
import type { Character, ClassId, ItemInstance } from "@ton-abyss/shared";
import { ECONOMY, derivedFromPrimary, primaryStatsFor, xpTotalForLevel } from "@ton-abyss/shared";
import { ITEMS } from "@ton-abyss/content";
import { z } from "zod";
import { nowMs } from "../db.js";

const CreateChar = z.object({
  classId: z.enum(["warden", "runesmith", "voidcaller", "beastbound"]),
  hardcore: z.boolean().default(true),
});

function newCharacter(userId: string, classId: ClassId, hardcore: boolean): Character {
  const primary = primaryStatsFor(classId, 1, {});
  const derived = derivedFromPrimary(classId, primary);
  return {
    id: `c_${userId}_${Math.random().toString(36).slice(2, 8)}`,
    classId,
    level: 1,
    xp: 0,
    stats: primary,
    unspentPoints: 0,
    hpCurrent: derived.maxHp,
    manaCurrent: derived.maxMana,
    gold: ECONOMY.START_GOLD,
    shards: ECONOMY.START_SHARDS,
    abyssDust: ECONOMY.START_ABYSS_DUST,
    deaths: 0,
    deepestFloor: 0,
    createdAt: nowMs(),
    hardcoreMode: hardcore,
  };
}

function starterInventory(classId: ClassId): { inventory: ItemInstance[]; equipped: Record<string, string | null>; materials: Record<string, number> } {
  const uid = (b: string) => `start_${b}_${Math.random().toString(36).slice(2, 8)}`;
  const mk = (baseId: string): ItemInstance => ({
    uid: uid(baseId),
    baseId,
    rarity: "common",
    level: 1,
    affixes: [],
    upgradeLevel: 0,
    createdAt: nowMs(),
  });
  const weapon = classId === "runesmith" || classId === "voidcaller"
    ? mk("wpn_novice_staff")
    : classId === "beastbound"
      ? mk("wpn_beast_claws")
      : mk("wpn_rusty_shortsword");
  const chest = mk("arm_leather_vest");
  const head = mk("arm_leather_cap");
  const legs = mk("arm_leather_legs");
  const hands = mk("arm_leather_gloves");
  const feet = mk("arm_leather_boots");
  const potion = mk("con_minor_hp_potion");
  const inventory = [weapon, chest, head, legs, hands, feet, potion];
  const equipped = {
    weapon: weapon.uid,
    chest: chest.uid,
    head: head.uid,
    legs: legs.uid,
    hands: hands.uid,
    feet: feet.uid,
  };
  const materials: Record<string, number> = { mat_linen: 2, mat_leather: 2 };
  return { inventory, equipped, materials };
}

export async function registerGameRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/state", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "unauthorized" });
    const state = loadState(req.user.id);
    return { state };
  });

  app.post("/api/character", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "unauthorized" });
    const parsed = CreateChar.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.message });
    const existing = loadState(req.user.id);
    if (existing && !existing.character.hardcoreMode) {
      return reply.code(400).send({ error: "character exists" });
    }
    const char = newCharacter(req.user.id, parsed.data.classId, parsed.data.hardcore);
    const starter = starterInventory(parsed.data.classId);
    saveState(req.user.id, {
      character: char,
      inventory: starter.inventory,
      equipped: starter.equipped,
      materials: starter.materials,
      pets: [],
    });
    return { ok: true, character: char };
  });

  app.post("/api/character/allocate", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "unauthorized" });
    const parsed = z.object({ stat: z.enum(["strength", "agility", "intellect", "vitality", "spirit", "luck"]) }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.message });
    const state = loadState(req.user.id);
    if (!state) return reply.code(404).send({ error: "no character" });
    if (state.character.unspentPoints <= 0) return reply.code(400).send({ error: "no points" });
    state.character.unspentPoints--;
    state.character.stats[parsed.data.stat]++;
    saveState(req.user.id, state);
    return { ok: true, character: state.character };
  });

  app.post("/api/character/equip", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "unauthorized" });
    const parsed = z.object({ uid: z.string(), slot: z.string() }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.message });
    const state = loadState(req.user.id);
    if (!state) return reply.code(404).send({ error: "no character" });
    const item = state.inventory.find((i) => i.uid === parsed.data.uid);
    if (!item) return reply.code(404).send({ error: "no item" });
    const base = ITEMS[item.baseId];
    if (!base || base.slot !== parsed.data.slot) return reply.code(400).send({ error: "wrong slot" });
    state.equipped[parsed.data.slot] = item.uid;
    saveState(req.user.id, state);
    return { ok: true };
  });

  app.get("/api/leaderboard", async () => {
    // Placeholder: deepestFloor ladder (DB scan).
    return { entries: [] };
  });

  void xpTotalForLevel; // keep import referenced
}
