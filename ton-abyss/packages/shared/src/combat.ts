import type {
  AbilityDef,
  AbilityId,
  CombatActor,
  CombatEvent,
  CombatState,
  DerivedStats,
  ElementId,
  StatusEffect,
} from "./types.js";
import { RNG } from "./rng.js";

// Hardcore combat formulas.
// Damage is computed from attacker.attack (or spellPower) and a base-ability multiplier,
// then reduced by a defense curve that never exceeds 75% mitigation, further
// modified by elemental resistance, crit, block and random variance ±6%.

export function defenseMitigation(defense: number, attackerLevel: number): number {
  // Soft-cap mitigation. 75% absolute cap.
  const scaled = defense / (defense + 50 + attackerLevel * 12);
  return Math.max(0, Math.min(0.75, scaled));
}

export function computeIncomingDamage(
  attacker: CombatActor,
  defender: CombatActor,
  base: number,
  element: ElementId,
  rng: RNG,
  opts: { canCrit?: boolean; canBlock?: boolean; canDodge?: boolean } = {},
): { dmg: number; crit: boolean; blocked: boolean; dodged: boolean } {
  const canCrit = opts.canCrit ?? true;
  const canBlock = opts.canBlock ?? true;
  const canDodge = opts.canDodge ?? true;

  // Hit check.
  if (canDodge) {
    const hit = attacker.stats.accuracy - defender.stats.dodge;
    if (!rng.chance(Math.max(0.1, hit))) {
      return { dmg: 0, crit: false, blocked: false, dodged: true };
    }
  }

  let dmg = base;
  // Elemental bonus/penalty via resistance.
  const res = defender.stats.resistance[element] ?? 0;
  dmg = dmg * (1 - res);
  // Defense.
  const mit = defenseMitigation(defender.stats.defense, attacker.level);
  dmg = dmg * (1 - mit);
  // Variance.
  dmg = dmg * rng.range(0.94, 1.06);
  // Crit.
  let crit = false;
  if (canCrit && rng.chance(attacker.stats.critChance)) {
    dmg = dmg * attacker.stats.critMultiplier;
    crit = true;
  }
  // Block.
  let blocked = false;
  if (canBlock && rng.chance(defender.stats.blockChance)) {
    dmg = Math.max(0, dmg - defender.stats.blockAmount);
    blocked = true;
  }
  // Statuses: fortify (reduce taken), weakness (reduce dealt), mark (amplify taken).
  const fortify = statusValue(defender.statuses, "fortify");
  if (fortify) dmg *= 1 - Math.min(0.5, fortify);
  const weakness = statusValue(attacker.statuses, "weakness");
  if (weakness) dmg *= 1 - Math.min(0.5, weakness);
  const mark = statusValue(defender.statuses, "mark");
  if (mark) dmg *= 1 + Math.min(0.8, mark);

  return { dmg: Math.max(1, Math.round(dmg)), crit, blocked, dodged: false };
}

export function statusValue(statuses: StatusEffect[], id: string): number {
  let v = 0;
  for (const s of statuses) if (s.id === id) v += s.potency * (s.stacks ?? 1);
  return v;
}

export function tickStatuses(actor: CombatActor, rng: RNG): CombatEvent[] {
  const out: CombatEvent[] = [];
  const remain: StatusEffect[] = [];
  const expired: StatusEffect["id"][] = [];
  for (const s of actor.statuses) {
    // DoTs
    if (s.id === "bleed" || s.id === "burn" || s.id === "poison") {
      const tick = Math.max(1, Math.round(s.potency * (s.stacks ?? 1)));
      actor.hp -= tick;
      out.push({
        turn: 0,
        actor: actor.id,
        damage: tick,
        flavor: `${actor.name} получает ${tick} (${s.id})`,
      });
    } else if (s.id === "regen") {
      const heal = Math.round(actor.stats.maxHp * s.potency);
      actor.hp = Math.min(actor.stats.maxHp, actor.hp + heal);
      out.push({ turn: 0, actor: actor.id, heal, flavor: `${actor.name} восстанавливает ${heal}` });
    }
    const next = { ...s, duration: s.duration - 1 };
    if (next.duration > 0) remain.push(next);
    else expired.push(s.id);
  }
  actor.statuses = remain;
  if (expired.length) out.push({ turn: 0, actor: actor.id, expired });
  return out;
}

export function turnOrder(actors: CombatActor[], rng: RNG): CombatActor[] {
  // Speed-weighted jittered order for this turn.
  return actors
    .slice()
    .sort((a, b) => {
      const sa = a.stats.speed + rng.range(-2, 2);
      const sb = b.stats.speed + rng.range(-2, 2);
      return sb - sa;
    });
}

export function pickEnemyAbility(
  actor: CombatActor,
  abilities: Record<AbilityId, AbilityDef>,
  rng: RNG,
): AbilityDef | null {
  const usable = actor.abilities
    .map((id) => abilities[id])
    .filter((a): a is AbilityDef => !!a && (actor.cooldowns[a.id] ?? 0) <= 0 && actor.mana >= a.manaCost);
  if (!usable.length) return null;
  // Weighted: prefer higher impact abilities slightly.
  return rng.weighted(usable.map((a) => ({ weight: 1 + (a.baseDamage ?? 0) / 20, value: a })));
}

export function applyDamage(actor: CombatActor, dmg: number): boolean {
  actor.hp -= dmg;
  if (actor.hp <= 0) {
    actor.hp = 0;
    return true;
  }
  return false;
}
