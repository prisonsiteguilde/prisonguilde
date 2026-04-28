import { randomUUID } from "node:crypto";
import {
  addProfessionXp,
  addXp,
  battleActionSchema,
  chestOpenSchema,
  chests,
  craftStartSchema,
  createBattle,
  createLedgerEntry,
  enemies,
  items,
  marketListSchema,
  mergeInventory,
  openChest,
  recipes,
  resolvePlayerMove,
  rewardInventory
} from "@corsairs/shared";
import type { BattleState, CraftJob, InventoryItem, MarketListing, Player } from "@corsairs/shared";
import { createMintIntent, createNftReservation } from "./ton.js";
import type { AnticheatService } from "./anticheat.js";
import type { GameStore } from "./store.js";

export class GameService {
  constructor(
    private readonly store: GameStore,
    private readonly anticheat: AnticheatService,
    private readonly tonCollectionAddress: string
  ) {}

  async home(playerId: string) {
    const db = this.store.snapshot();
    const player = await this.store.getPlayer(playerId);
    return {
      player,
      catalog: { items, enemies, recipes, chests },
      activeBattles: db.battles.filter((battle) => battle.playerId === playerId && battle.phase !== "finished"),
      craftJobs: db.craftJobs.filter((job) => job.playerId === playerId),
      market: db.market.filter((listing) => listing.status === "active").slice(0, 50),
      anticheat: db.anticheat.filter((signal) => signal.playerId === playerId).slice(-10)
    };
  }

  async startBattle(playerId: string, enemyId: string, nonce: number): Promise<BattleState> {
    await this.ensureNonce(playerId, nonce);
    const player = await this.store.getPlayer(playerId);
    const rateSignal = this.anticheat.trackRate(playerId, "battle_start", 5);
    if (rateSignal) await this.store.addSignal(rateSignal);
    const enemy = enemies.find((entry) => entry.id === enemyId);
    if (!enemy) throw new Error("Враг не найден");
    if (player.level + 4 < enemy.level) throw new Error("Слишком опасный противник для текущего уровня");
    const battle = createBattle(player, enemyId, `${playerId}:${enemyId}:${Date.now()}:${nonce}`);
    return this.store.addBattle(battle);
  }

  async battleAction(playerId: string, payload: unknown): Promise<{ battle: BattleState; player: Player | null; rewards?: ReturnType<typeof rewardInventory> }> {
    const input = battleActionSchema.parse(payload);
    await this.ensureNonce(playerId, input.nonce);
    const battle = await this.store.getBattle(input.battleId);
    if (battle.playerId !== playerId) throw new Error("Этот бой принадлежит другому игроку");
    const timingSignal = this.anticheat.validateTiming(playerId, input.clientTick, battle.startedAt);
    if (timingSignal) await this.store.addSignal(timingSignal);
    const nextBattle = resolvePlayerMove(battle, input.moveId);
    await this.store.updateBattle(nextBattle);
    if (nextBattle.phase !== "finished" || nextBattle.winner !== "player" || nextBattle.rewardsClaimed) {
      return { battle: nextBattle, player: null };
    }
    return this.claimBattleRewards(playerId, nextBattle.id);
  }

  async claimBattleRewards(playerId: string, battleId: string): Promise<{ battle: BattleState; player: Player; rewards: ReturnType<typeof rewardInventory> }> {
    const battle = await this.store.getBattle(battleId);
    if (battle.playerId !== playerId) throw new Error("Этот бой принадлежит другому игроку");
    if (battle.phase !== "finished" || battle.winner !== "player") throw new Error("Награда доступна только за победу");
    if (battle.rewardsClaimed) throw new Error("Награда уже получена");
    const enemy = enemies.find((entry) => entry.id === battle.enemyId);
    if (!enemy) throw new Error("Враг не найден");
    const rewards = rewardInventory(enemy.rewards, `${battle.seed}:rewards`);
    let player = await this.store.getPlayer(playerId);
    player = addXp(player, rewards.xp);
    const quests = { ...player.quests };
    if (quests.tortuga_first_blood?.status === "active") {
      quests.tortuga_first_blood = { status: "completed", progress: 1, goal: 1 };
    }
    player = {
      ...player,
      currencies: {
        ...player.currencies,
        piastres: player.currencies.piastres + rewards.piastres,
        doubloons: player.currencies.doubloons + rewards.doubloons
      },
      inventory: mergeInventory([...player.inventory, ...rewards.items]),
      quests,
      updatedAt: new Date().toISOString()
    };
    await this.store.upsertPlayer(player);
    await this.store.addLedger(createLedgerEntry(player, "source", "piastres", rewards.piastres, `battle:${battle.enemyId}`));
    const nextBattle = { ...battle, rewardsClaimed: true };
    await this.store.updateBattle(nextBattle);
    return { battle: nextBattle, player, rewards };
  }

  async openChest(playerId: string, payload: unknown) {
    const input = chestOpenSchema.parse(payload);
    await this.ensureNonce(playerId, input.nonce);
    const player = await this.store.getPlayer(playerId);
    const result = openChest(player, input.chestId, `${playerId}:${input.chestId}:${Date.now()}:${input.nonce}`);
    const rewardsWithNft = result.rewards.map((item) => reserveNftIfNeeded(item, this.tonCollectionAddress));
    const nextPlayer = {
      ...result.player,
      inventory: result.player.inventory.map((item) => rewardsWithNft.find((reward) => reward.uid === item.uid) ?? item)
    };
    await this.store.upsertPlayer(nextPlayer);
    await this.store.addLedger(createLedgerEntry(nextPlayer, "sink", "piastres", -(chests.find((entry) => entry.id === input.chestId)?.price.piastres ?? 0), `chest:${input.chestId}`));
    return { ...result, rewards: rewardsWithNft, player: nextPlayer };
  }

  async startCraft(playerId: string, payload: unknown): Promise<{ job: CraftJob; player: Player }> {
    const input = craftStartSchema.parse(payload);
    await this.ensureNonce(playerId, input.nonce);
    const recipe = recipes.find((entry) => entry.id === input.recipeId);
    if (!recipe) throw new Error("Рецепт не найден");
    let player = await this.store.getPlayer(playerId);
    const profession = player.professions[recipe.profession];
    if (profession.level < recipe.requiredLevel) throw new Error("Недостаточный уровень профессии");
    const activeJobs = this.store.snapshot().craftJobs.filter((job) => job.playerId === playerId && !job.claimed && Date.now() < new Date(job.completesAt).getTime());
    if (activeJobs.length >= profession.queueSlots) throw new Error("Очередь крафта заполнена");
    player = spendInputs(player, recipe.inputs);
    const now = Date.now();
    const job: CraftJob = {
      id: `craft_${randomUUID()}`,
      playerId,
      recipeId: recipe.id,
      startedAt: new Date(now).toISOString(),
      completesAt: new Date(now + recipe.durationSeconds * 1000).toISOString(),
      claimed: false
    };
    await this.store.upsertPlayer(player);
    await this.store.addCraftJob(job);
    return { job, player };
  }

  async claimCraft(playerId: string, jobId: string): Promise<{ job: CraftJob; player: Player; item: InventoryItem }> {
    const job = this.store.snapshot().craftJobs.find((entry) => entry.id === jobId);
    if (!job) throw new Error("Крафт-задача не найдена");
    if (job.playerId !== playerId) throw new Error("Это не ваша крафт-задача");
    if (job.claimed) throw new Error("Предмет уже получен");
    if (Date.now() < new Date(job.completesAt).getTime()) throw new Error("Крафт ещё не завершён");
    const recipe = recipes.find((entry) => entry.id === job.recipeId);
    if (!recipe) throw new Error("Рецепт не найден");
    const definition = items.find((entry) => entry.id === recipe.output.itemId);
    if (!definition) throw new Error("Предмет не найден");
    let player = await this.store.getPlayer(playerId);
    const superiorChance = recipe.output.superiorChance + player.professions[recipe.profession].level * 0.004;
    const superior = Math.random() < superiorChance;
    const item: InventoryItem = reserveNftIfNeeded({
      uid: `craft_${recipe.output.itemId}_${Date.now()}`,
      itemId: recipe.output.itemId,
      rarity: definition.rarity,
      quantity: recipe.output.quantity,
      enhancement: 0,
      superior
    }, this.tonCollectionAddress);
    player = addProfessionXp({ ...player, inventory: [...player.inventory, item] }, recipe.profession, recipe.xp);
    if (recipe.id === "steel" && player.quests.craft_first_steel?.status === "active") {
      player = {
        ...player,
        quests: { ...player.quests, craft_first_steel: { status: "completed", progress: 1, goal: 1 } }
      };
    }
    const claimed = { ...job, claimed: true };
    await this.store.updateCraftJob(claimed);
    await this.store.upsertPlayer(player);
    return { job: claimed, player, item };
  }

  async listMarket(playerId: string, payload: unknown): Promise<MarketListing> {
    const input = marketListSchema.parse(payload);
    await this.ensureNonce(playerId, input.nonce);
    let player = await this.store.getPlayer(playerId);
    const item = player.inventory.find((entry) => entry.uid === input.itemUid);
    if (!item) throw new Error("Предмет не найден");
    const definition = items.find((entry) => entry.id === item.itemId);
    if (!definition) throw new Error("Предмет не найден");
    if (definition.soulbound) throw new Error("Soulbound-предмет нельзя продавать");
    player = { ...player, inventory: player.inventory.filter((entry) => entry.uid !== input.itemUid) };
    const now = Date.now();
    const price: MarketListing["price"] = {};
    if (input.price.piastres !== undefined) price.piastres = input.price.piastres;
    if (input.price.doubloons !== undefined) price.doubloons = input.price.doubloons;
    const listing: MarketListing = {
      id: `listing_${randomUUID()}`,
      sellerId: playerId,
      item,
      price,
      kind: input.kind,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + input.hours * 3600_000).toISOString(),
      bids: [],
      status: "active"
    };
    await this.store.upsertPlayer(player);
    return this.store.addMarketListing(listing);
  }

  async tonMintIntent(playerId: string, itemUid: string, ownerAddress: string) {
    const player = await this.store.getPlayer(playerId);
    const item = player.inventory.find((entry) => entry.uid === itemUid);
    if (!item) throw new Error("Предмет не найден");
    const definition = items.find((entry) => entry.id === item.itemId);
    if (!definition?.nftEligible) throw new Error("Этот предмет не NFT-eligible");
    return createMintIntent(item, ownerAddress, this.tonCollectionAddress);
  }

  private async ensureNonce(playerId: string, nonce: number): Promise<void> {
    const accepted = await this.store.consumeNonce(playerId, nonce);
    if (!accepted) {
      await this.store.addSignal(this.anticheat.signal(playerId, "critical", "signature", "Replay nonce rejected", { nonce }));
      throw new Error("Повтор запроса отклонён античитом");
    }
  }
}

function spendInputs(player: Player, inputs: Array<{ itemId: string; quantity: number }>): Player {
  const inventory = player.inventory.map((item) => ({ ...item }));
  for (const input of inputs) {
    let remaining = input.quantity;
    for (const item of inventory) {
      if (item.itemId !== input.itemId || remaining <= 0) continue;
      const spent = Math.min(item.quantity, remaining);
      item.quantity -= spent;
      remaining -= spent;
    }
    if (remaining > 0) throw new Error(`Недостаточно ресурсов: ${input.itemId}`);
  }
  return {
    ...player,
    inventory: inventory.filter((item) => item.quantity > 0),
    updatedAt: new Date().toISOString()
  };
}

function reserveNftIfNeeded(item: InventoryItem, collectionAddress: string): InventoryItem {
  const definition = items.find((entry) => entry.id === item.itemId);
  if (!definition?.nftEligible) return item;
  return {
    ...item,
    nft: createNftReservation(item, collectionAddress)
  };
}
