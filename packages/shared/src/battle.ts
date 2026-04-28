import { enemies, items, moves } from "./content.js";
import { createRng } from "./rng.js";
import type { BattleActor, BattleLogEntry, BattleState, EnemyDefinition, InventoryItem, MoveDefinition, Player, RewardTable, StatBlock } from "./types.js";

export function createBattle(player: Player, enemyId: string, seed: string): BattleState {
  const enemy = enemies.find((entry) => entry.id === enemyId);
  if (!enemy) {
    throw new Error(`Unknown enemy: ${enemyId}`);
  }

  const playerActor = createPlayerActor(player);
  const enemyActor = createEnemyActor(enemy);
  const playerStarts = playerActor.stats.initiative >= enemyActor.stats.initiative;
  const now = new Date().toISOString();

  return {
    id: `battle_${seed.slice(0, 12)}`,
    playerId: player.id,
    enemyId,
    seed,
    turn: 1,
    phase: playerStarts ? "player" : "enemy",
    player: playerActor,
    enemy: enemyActor,
    log: [
      {
        turn: 1,
        actorId: "system",
        action: "battle_start",
        message: `${playerActor.name} вступает в бой: ${enemyActor.name}. ${playerStarts ? "Игрок ходит первым." : "Враг перехватил инициативу."}`
      }
    ],
    rewardsClaimed: false,
    startedAt: now,
    updatedAt: now
  };
}

export function resolvePlayerMove(state: BattleState, moveId: string): BattleState {
  if (state.phase !== "player") {
    throw new Error("Сейчас не ход игрока");
  }
  const move = availablePlayerMoves(state.player).find((entry) => entry.id === moveId);
  if (!move) {
    throw new Error("Приём недоступен");
  }

  const next = applyMove(state, state.player, state.enemy, move, "player");
  if (next.phase === "finished") return next;
  return runEnemyTurn(next);
}

export function runEnemyTurn(state: BattleState): BattleState {
  if (state.phase === "finished") return state;
  const validMoves = Object.values(moves).filter((move) => canUseMove(state.enemy, state.player, move));
  const rng = createRng(`${state.seed}:enemy:${state.turn}:${state.log.length}`);
  const move = validMoves.length > 0 ? rng.pick(validMoves) : requireMove("slash");
  const next = applyMove(state, state.enemy, state.player, move, "enemy");
  if (next.phase === "finished") return next;

  return {
    ...next,
    phase: "player",
    turn: next.turn + 1,
    player: refreshActor(tickEffects(next.player, next.turn), "new_turn"),
    enemy: refreshActor(tickEffects(next.enemy, next.turn), "cooldown"),
    updatedAt: new Date().toISOString()
  };
}

export function availablePlayerMoves(actor: BattleActor): MoveDefinition[] {
  const loadoutMoves = actor.id === "player"
    ? ["thrust", "slash", "riposte", "pistol", "bomb", "skullbreaker", "harvest"].map(requireMove)
    : Object.values(moves);
  return loadoutMoves.filter((move) => canUseMove(actor, undefined, move));
}

export function rewardInventory(reward: RewardTable, seed: string): { xp: number; piastres: number; doubloons: number; items: InventoryItem[] } {
  const rng = createRng(seed);
  const rolledItems = reward.items.flatMap((roll) => {
    if (!rng.chance(roll.chance)) return [];
    const definition = items.find((item) => item.id === roll.itemId);
    if (!definition) return [];
    const quantity = rng.integer(roll.minQty, roll.maxQty);
    return [
      {
        uid: `itm_${seed.slice(0, 8)}_${roll.itemId}_${rng.integer(1000, 9999)}`,
        itemId: definition.id,
        rarity: definition.rarity,
        quantity,
        enhancement: 0,
        superior: rng.chance(definition.rarity === "rare" ? 0.05 : definition.rarity === "epic" ? 0.1 : 0.01)
      }
    ];
  });

  return {
    xp: reward.xp,
    piastres: rng.integer(reward.piastres[0], reward.piastres[1]),
    doubloons: reward.doubloons ? rng.integer(reward.doubloons[0], reward.doubloons[1]) : 0,
    items: rolledItems
  };
}

function applyMove(state: BattleState, actor: BattleActor, target: BattleActor, move: MoveDefinition, side: "player" | "enemy"): BattleState {
  if (!canUseMove(actor, target, move)) {
    throw new Error("Недостаточно действий, энергии или условие приёма не выполнено");
  }

  const rng = createRng(`${state.seed}:${state.turn}:${state.log.length}:${move.id}`);
  const hitChance = clamp((actor.stats.accuracy - target.stats.evasion) / 100, 0.1, 0.98);
  const hit = rng.chance(hitChance);
  const effects: string[] = [];
  let damage = 0;
  let critical = false;

  if (hit) {
    const variance = 0.9 + rng.next() * 0.2;
    const vulnerability = side === "player" ? enemyVulnerability(state.enemyId, move.damageType) : 1;
    const weaponBase = actor.side === "player" ? playerWeaponDamage(actor) : 30 + state.turn * 4 + actor.stats.armor * 0.3;
    const raw = weaponBase * move.damageMultiplier * vulnerability * variance;
    const armorIgnored = move.damageType === "firearm" || move.damageType === "fire" ? 0.35 : 0;
    const afterArmor = Math.max(raw - target.stats.armor * (1 - armorIgnored), 1);
    const resistance = target.stats.resistances[move.damageType] ?? 0;
    critical = rng.chance(clamp(actor.stats.critChance / 100, 0, 0.75));
    damage = Math.floor(afterArmor * (1 - resistance) * (critical ? actor.stats.critMultiplier : 1));
  }

  const targetAfterDamage = {
    ...target,
    stats: {
      ...target.stats,
      hp: Math.max(0, target.stats.hp - damage)
    },
    effects: hit && move.effects ? mergeEffects(target.effects, move.effects.map((effect) => ({ ...effect, sourceId: actor.id, remaining: effect.duration }))) : target.effects,
    defeated: target.stats.hp - damage <= 0
  };

  if (hit && move.effects) {
    effects.push(...move.effects.map((effect) => effect.type));
  }

  const actorAfterCost = {
    ...actor,
    actionPoints: Math.max(0, actor.actionPoints - move.actionCost),
    stats: {
      ...actor.stats,
      energy: Math.max(0, actor.stats.energy - move.energyCost)
    },
    cooldowns: move.cooldown > 0 ? { ...actor.cooldowns, [move.id]: move.cooldown } : actor.cooldowns
  };

  const log: BattleLogEntry = {
    turn: state.turn,
    actorId: actor.id,
    action: move.id,
    message: hit ? `${actor.name}: ${move.name} наносит ${damage}${critical ? " крит." : ""} урона.` : `${actor.name}: ${move.name} — промах.`,
    damage,
    critical,
    effects
  };

  const player = actor.side === "player" ? actorAfterCost : targetAfterDamage;
  const enemy = actor.side === "enemy" ? actorAfterCost : targetAfterDamage;
  const phase = player.defeated || enemy.defeated ? "finished" : actor.side === "player" && actorAfterCost.actionPoints > 0 ? "player" : "enemy";
  const result: BattleState = {
    ...state,
    phase,
    player,
    enemy,
    log: [...state.log, log],
    updatedAt: new Date().toISOString()
  };
  if (phase === "finished") {
    result.winner = enemy.defeated ? "player" : "enemy";
  }
  return result;
}

function createPlayerActor(player: Player): BattleActor {
  return {
    id: "player",
    name: player.displayName,
    side: "player",
    stats: { ...player.stats, hp: Math.max(1, player.stats.hp), energy: Math.min(100, player.stats.energy) },
    effects: [],
    cooldowns: {},
    actionPoints: player.stats.stamina,
    defeated: false
  };
}

function createEnemyActor(enemy: EnemyDefinition): BattleActor {
  return {
    id: enemy.id,
    name: enemy.name,
    side: "enemy",
    stats: { ...enemy.stats },
    effects: [],
    cooldowns: {},
    actionPoints: enemy.stats.stamina,
    defeated: false
  };
}

function canUseMove(actor: BattleActor, target: BattleActor | undefined, move: MoveDefinition): boolean {
  const targetHpPercent = target ? target.stats.hp / target.stats.maxHp : 1;
  return actor.actionPoints >= move.actionCost && actor.stats.energy >= move.energyCost && (actor.cooldowns[move.id] ?? 0) <= 0 && (!move.minTargetHpPercent || targetHpPercent * 100 <= move.minTargetHpPercent);
}

function tickEffects(actor: BattleActor, turn: number): BattleActor {
  let hp = actor.stats.hp;
  const nextEffects = actor.effects.flatMap((effect) => {
    if (effect.type === "poison") hp -= Math.floor(actor.stats.maxHp * effect.power * effect.stacks);
    if (effect.type === "bleed") hp -= Math.floor(actor.stats.maxHp * effect.power * 0.35 * effect.stacks);
    if (effect.type === "burn") hp -= Math.floor(actor.stats.maxHp * effect.power);
    if (effect.type === "regen") hp += Math.floor(actor.stats.maxHp * effect.power);
    const remaining = effect.remaining - 1;
    return remaining > 0 ? [{ ...effect, remaining }] : [];
  });

  return {
    ...actor,
    stats: {
      ...actor.stats,
      hp: clamp(Math.floor(hp), 0, actor.stats.maxHp)
    },
    effects: nextEffects,
    defeated: hp <= 0,
    actionPoints: actor.stats.stamina,
    cooldowns: Object.fromEntries(Object.entries(actor.cooldowns).map(([key, value]) => [key, Math.max(0, value - 1)])),
    id: actor.id === "enemy" ? `${actor.id}_${turn}` : actor.id
  };
}

function refreshActor(actor: BattleActor, reason: "new_turn" | "cooldown"): BattleActor {
  return {
    ...actor,
    actionPoints: actor.stats.stamina,
    stats: {
      ...actor.stats,
      energy: Math.min(100, actor.stats.energy + (reason === "new_turn" ? 5 : 3))
    }
  };
}

function mergeEffects(current: BattleActor["effects"], incoming: BattleActor["effects"]): BattleActor["effects"] {
  return incoming.reduce<BattleActor["effects"]>((effects, effect) => {
    const existingIndex = effects.findIndex((entry) => entry.type === effect.type && entry.sourceId === effect.sourceId);
    if (existingIndex === -1) return [...effects, effect];
    return effects.map((entry, index) => {
      if (index !== existingIndex) return entry;
      return {
        ...entry,
        remaining: Math.max(entry.remaining, effect.remaining),
        stacks: Math.min(entry.stacks + effect.stacks, 5)
      };
    });
  }, current);
}

function enemyVulnerability(enemyId: string, damageType: MoveDefinition["damageType"]): number {
  const enemy = enemies.find((entry) => entry.id === enemyId);
  return enemy?.vulnerabilities[damageType] ?? 1;
}

function requireMove(id: keyof typeof moves): MoveDefinition {
  const move = moves[id];
  if (!move) throw new Error(`Move is not configured: ${String(id)}`);
  return move;
}

function playerWeaponDamage(actor: BattleActor): number {
  return 38 + actor.stats.crewPower * 0.18 + actor.stats.initiative * 0.08;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
