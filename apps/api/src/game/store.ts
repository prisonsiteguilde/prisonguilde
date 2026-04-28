import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createBaseStats, mergeInventory, shipClasses } from "@corsairs/shared";
import type { AnticheatSignal, BattleState, CraftJob, LedgerEntry, MarketListing, Player, Profession } from "@corsairs/shared";

export interface GameDatabase {
  players: Player[];
  battles: BattleState[];
  craftJobs: CraftJob[];
  market: MarketListing[];
  ledger: LedgerEntry[];
  anticheat: AnticheatSignal[];
  nonce: Record<string, number>;
}

const initialDatabase: GameDatabase = {
  players: [],
  battles: [],
  craftJobs: [],
  market: [],
  ledger: [],
  anticheat: [],
  nonce: {}
};

export class GameStore {
  private db: GameDatabase = initialDatabase;
  private loaded = false;

  constructor(private readonly path: string) {}

  async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const raw = await readFile(this.path, "utf8");
      this.db = JSON.parse(raw) as GameDatabase;
    } catch {
      await mkdir(dirname(this.path), { recursive: true });
      this.db = structuredClone(initialDatabase);
      await this.persist();
    }
    this.loaded = true;
  }

  snapshot(): GameDatabase {
    return structuredClone(this.db);
  }

  async persist(): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(this.path, JSON.stringify(this.db, null, 2));
  }

  async upsertPlayer(player: Player): Promise<Player> {
    await this.load();
    const index = this.db.players.findIndex((entry) => entry.id === player.id);
    if (index === -1) {
      this.db.players.push(player);
    } else {
      this.db.players[index] = player;
    }
    await this.persist();
    return player;
  }

  async getOrCreatePlayer(input: { telegramId: string; username: string; displayName: string; faction: Player["faction"] }): Promise<Player> {
    await this.load();
    const existing = this.db.players.find((player) => player.telegramId === input.telegramId);
    if (existing) return existing;
    const now = new Date().toISOString();
    const shipClass = shipClasses[0];
    const professions = Object.fromEntries((["blacksmith", "alchemist", "shipwright", "relicsmith"] as Profession[]).map((profession) => [
      profession,
      { level: 1, xp: 0, queueSlots: profession === "blacksmith" ? 2 : 1 }
    ])) as Player["professions"];
    const player: Player = {
      id: `plr_${input.telegramId}`,
      telegramId: input.telegramId,
      username: input.username,
      displayName: input.displayName,
      createdAt: now,
      updatedAt: now,
      level: 1,
      xp: 0,
      prestige: 0,
      skillPoints: 1,
      bonusPoints: 0,
      islandId: "tortuga",
      faction: input.faction,
      currencies: { piastres: 1250, doubloons: 15, stars: 0 },
      stats: createBaseStats(1),
      inventory: mergeInventory([
        { uid: "starter_cutlass", itemId: "rusty-cutlass", rarity: "common", quantity: 1, enhancement: 0, superior: false },
        { uid: "starter_vest", itemId: "tortuga-vest", rarity: "uncommon", quantity: 1, enhancement: 0, superior: false },
        { uid: "starter_ore", itemId: "iron-ore", rarity: "common", quantity: 8, enhancement: 0, superior: false },
        { uid: "starter_coal", itemId: "coal", rarity: "common", quantity: 4, enhancement: 0, superior: false }
      ]),
      equipment: { mainHand: "starter_cutlass", chest: "starter_vest" },
      professions,
      pets: [
        { id: "pet_macaw_1", name: "Грогги", level: 1, xp: 0, loyalty: 55, evolution: "cub" }
      ],
      activePetId: "pet_macaw_1",
      ship: {
        id: "ship_1",
        name: "Вольная Чайка",
        classId: shipClass.id,
        hp: shipClass.hp,
        upgrades: {},
        officers: [],
        trophies: 0,
        aiPreset: [
          { id: "distance", priority: 1, condition: "enemy_distance_close", action: "maneuver_retreat" },
          { id: "sails", priority: 2, condition: "enemy_sails_hp_above_70", action: "chain_shot" },
          { id: "hull", priority: 3, condition: "enemy_hull_hp_above_0", action: "round_shot" }
        ]
      },
      quests: {
        tortuga_first_blood: { status: "active", progress: 0, goal: 1 },
        craft_first_steel: { status: "active", progress: 0, goal: 1 }
      },
      pity: {},
      daily: { streak: 0, earnedChestToday: false },
      flags: {}
    };
    this.db.players.push(player);
    await this.persist();
    return player;
  }

  async getPlayer(playerId: string): Promise<Player> {
    await this.load();
    const player = this.db.players.find((entry) => entry.id === playerId);
    if (!player) throw new Error("Игрок не найден");
    return player;
  }

  async addBattle(battle: BattleState): Promise<BattleState> {
    await this.load();
    this.db.battles.push(battle);
    await this.persist();
    return battle;
  }

  async updateBattle(battle: BattleState): Promise<BattleState> {
    await this.load();
    const index = this.db.battles.findIndex((entry) => entry.id === battle.id);
    if (index === -1) throw new Error("Бой не найден");
    this.db.battles[index] = battle;
    await this.persist();
    return battle;
  }

  async getBattle(battleId: string): Promise<BattleState> {
    await this.load();
    const battle = this.db.battles.find((entry) => entry.id === battleId);
    if (!battle) throw new Error("Бой не найден");
    return battle;
  }

  async addCraftJob(job: CraftJob): Promise<CraftJob> {
    await this.load();
    this.db.craftJobs.push(job);
    await this.persist();
    return job;
  }

  async updateCraftJob(job: CraftJob): Promise<CraftJob> {
    await this.load();
    const index = this.db.craftJobs.findIndex((entry) => entry.id === job.id);
    if (index === -1) throw new Error("Крафт-задача не найдена");
    this.db.craftJobs[index] = job;
    await this.persist();
    return job;
  }

  async addMarketListing(listing: MarketListing): Promise<MarketListing> {
    await this.load();
    this.db.market.push(listing);
    await this.persist();
    return listing;
  }

  async addLedger(entry: LedgerEntry): Promise<void> {
    await this.load();
    this.db.ledger.push(entry);
    await this.persist();
  }

  async addSignal(signal: AnticheatSignal): Promise<void> {
    await this.load();
    this.db.anticheat.push(signal);
    await this.persist();
  }

  async consumeNonce(playerId: string, nonce: number): Promise<boolean> {
    await this.load();
    const last = this.db.nonce[playerId] ?? -1;
    if (nonce <= last) return false;
    this.db.nonce[playerId] = nonce;
    await this.persist();
    return true;
  }
}
