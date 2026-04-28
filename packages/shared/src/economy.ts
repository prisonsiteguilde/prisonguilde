import { chests, items, rarityRank } from "./content.js";
import { createRng } from "./rng.js";
import type { ChestDefinition, InventoryItem, LedgerEntry, Player, Rarity } from "./types.js";

export function openChest(player: Player, chestId: string, seed: string): { player: Player; rewards: InventoryItem[]; piastres: number; forcedPity: Rarity[] } {
  const chest = chests.find((entry) => entry.id === chestId);
  if (!chest) throw new Error("Сундук не найден");
  assertCanPay(player, chest);

  const rng = createRng(seed);
  const forcedPity = computePity(player, chest);
  const rewards: InventoryItem[] = [];
  let piastres = 0;

  for (const roll of chest.rolls) {
    const minimumRequired = roll.minimumRarity && forcedPity.includes(roll.minimumRarity);
    if (!minimumRequired && !rng.chance(roll.chance)) continue;
    if (roll.minPiastres !== undefined && roll.maxPiastres !== undefined) {
      piastres += rng.integer(roll.minPiastres, roll.maxPiastres);
    }
    if (roll.itemIds.length > 0) {
      const candidates = roll.minimumRarity ? roll.itemIds.filter((itemId) => {
        const definition = items.find((item) => item.id === itemId);
        return definition ? rarityRank[definition.rarity] >= rarityRank[roll.minimumRarity as Rarity] : false;
      }) : roll.itemIds;
      const itemId = rng.pick(candidates.length > 0 ? candidates : roll.itemIds);
      const definition = items.find((item) => item.id === itemId);
      if (!definition) continue;
      const reward: InventoryItem = {
        uid: `chest_${chestId}_${seed.slice(0, 10)}_${rewards.length}`,
        itemId,
        rarity: definition.rarity,
        quantity: rng.integer(roll.minQty, roll.maxQty),
        enhancement: 0,
        superior: rng.chance(0.02 + Math.min(player.professions.blacksmith.level, 50) * 0.004)
      };
      if (definition.nftEligible) {
        reward.nft = {
          status: "offchain_reserved",
          collectionAddress: "ton://collection/corsairs",
          metadataUri: `ipfs://corsairs/${itemId}/${seed}`
        };
      }
      rewards.push(reward);
    }
  }

  const paid = payChest(player, chest);
  const updatedPity = updatePityCounters(paid, chest, rewards);
  const nextPlayer: Player = {
    ...updatedPity,
    currencies: {
      ...updatedPity.currencies,
      piastres: updatedPity.currencies.piastres + piastres
    },
    inventory: mergeInventory([...updatedPity.inventory, ...rewards]),
    updatedAt: new Date().toISOString()
  };

  return { player: nextPlayer, rewards, piastres, forcedPity };
}

export function createLedgerEntry(player: Player, type: LedgerEntry["type"], currency: LedgerEntry["currency"], amount: number, reason: string): LedgerEntry {
  return {
    id: `ledger_${player.id}_${Date.now()}_${Math.abs(amount)}`,
    playerId: player.id,
    type,
    currency,
    amount,
    reason,
    balanceAfter: player.currencies[currency],
    createdAt: new Date().toISOString()
  };
}

export function mergeInventory(inventory: InventoryItem[]): InventoryItem[] {
  const stackable = new Map<string, InventoryItem>();
  const unique: InventoryItem[] = [];
  for (const item of inventory) {
    const definition = items.find((entry) => entry.id === item.itemId);
    const canStack = definition?.kind === "material" || definition?.kind === "potion";
    if (!canStack || item.nft || item.enhancement > 0 || item.superior) {
      unique.push(item);
      continue;
    }
    const current = stackable.get(item.itemId);
    if (!current) {
      stackable.set(item.itemId, { ...item });
    } else {
      stackable.set(item.itemId, { ...current, quantity: current.quantity + item.quantity });
    }
  }
  return [...unique, ...stackable.values()];
}

function assertCanPay(player: Player, chest: ChestDefinition): void {
  if (chest.price.piastres && player.currencies.piastres < chest.price.piastres) {
    throw new Error("Недостаточно пиастров");
  }
  if (chest.price.doubloons && player.currencies.doubloons < chest.price.doubloons) {
    throw new Error("Недостаточно дублонов");
  }
}

function payChest(player: Player, chest: ChestDefinition): Player {
  return {
    ...player,
    currencies: {
      ...player.currencies,
      piastres: player.currencies.piastres - (chest.price.piastres ?? 0),
      doubloons: player.currencies.doubloons - (chest.price.doubloons ?? 0)
    }
  };
}

function computePity(player: Player, chest: ChestDefinition): Rarity[] {
  const current = player.pity[chest.id] ?? 0;
  const forced: Rarity[] = [];
  if (chest.pity.epic && current + 1 >= chest.pity.epic) forced.push("epic");
  if (chest.pity.legendary && current + 1 >= chest.pity.legendary) forced.push("legendary");
  if (chest.pity.mythic && current + 1 >= chest.pity.mythic) forced.push("mythic");
  return forced;
}

function updatePityCounters(player: Player, chest: ChestDefinition, rewards: InventoryItem[]): Player {
  const bestRank = rewards.reduce((rank, item) => Math.max(rank, rarityRank[item.rarity]), 0);
  const resetRank = chest.pity.mythic ? rarityRank.mythic : chest.pity.legendary ? rarityRank.legendary : rarityRank.epic;
  const current = player.pity[chest.id] ?? 0;
  return {
    ...player,
    pity: {
      ...player.pity,
      [chest.id]: bestRank >= resetRank ? 0 : current + 1
    }
  };
}
