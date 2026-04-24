import type { CombatActor, CombatEvent, CombatState, AbilityDef } from "@ton-abyss/shared";
import { RNG, computeIncomingDamage, pickEnemyAbility, tickStatuses, turnOrder } from "@ton-abyss/shared";
import { ABILITIES } from "@ton-abyss/content";

const MAX_TURNS = 60;

export function resolveCombat(player: CombatActor, enemy: CombatActor, rng: RNG): CombatState {
  const state: CombatState = {
    seed: rng.next() * 2 ** 31,
    turn: 0,
    actors: [player, enemy],
    log: [],
    over: false,
  };

  while (!state.over && state.turn < MAX_TURNS) {
    state.turn++;
    const order = turnOrder(state.actors.filter((a) => a.hp > 0), rng);
    for (const actor of order) {
      if (actor.hp <= 0) continue;
      // Tick statuses at start of their turn.
      const tickEvents = tickStatuses(actor, rng);
      tickEvents.forEach((e) => state.log.push({ ...e, turn: state.turn }));
      if (actor.hp <= 0) {
        state.log.push({ turn: state.turn, actor: actor.id, killed: true, flavor: `${actor.name} погибает от эффекта` });
        continue;
      }
      // Decrement cooldowns.
      for (const k of Object.keys(actor.cooldowns)) actor.cooldowns[k] = Math.max(0, (actor.cooldowns[k] ?? 0) - 1);
      // Choose ability.
      const ability = chooseAbility(actor, rng);
      if (!ability) {
        state.log.push({ turn: state.turn, actor: actor.id, flavor: `${actor.name} колеблется.` });
        continue;
      }
      const target = actor.side === "player" ? state.actors.find((a) => a.side === "enemy")! : state.actors.find((a) => a.side === "player")!;
      resolveAbility(state, actor, target, ability, rng);
      if (target.hp <= 0) {
        state.log.push({ turn: state.turn, actor: target.id, killed: true, flavor: `${target.name} повержен!` });
        state.over = true;
        state.winner = actor.side;
        break;
      }
    }
  }
  if (!state.winner && !state.over) {
    // Time-out: higher HP% wins.
    const pp = state.actors[0]!.hp / state.actors[0]!.stats.maxHp;
    const ee = state.actors[1]!.hp / state.actors[1]!.stats.maxHp;
    state.winner = pp >= ee ? "player" : "enemy";
    state.over = true;
    state.log.push({ turn: state.turn, actor: "narration", flavor: "Время вышло." });
  }
  return state;
}

function chooseAbility(actor: CombatActor, rng: RNG): AbilityDef | null {
  if (actor.side === "player") {
    // Simple player AI: always pick highest-damage available within mana & cooldown.
    const usable = actor.abilities
      .map((id) => ABILITIES[id])
      .filter((a): a is AbilityDef => !!a && (actor.cooldowns[a.id] ?? 0) <= 0 && actor.mana >= a.manaCost);
    if (!usable.length) return ABILITIES["basic_strike"] ?? null;
    return usable.sort((a, b) => (b.baseDamage ?? 0) - (a.baseDamage ?? 0))[0] ?? null;
  }
  return pickEnemyAbility(actor, ABILITIES, rng) ?? ABILITIES["basic_strike"] ?? null;
}

function resolveAbility(state: CombatState, actor: CombatActor, target: CombatActor, ability: AbilityDef, rng: RNG): void {
  if (actor.mana < ability.manaCost) return;
  actor.mana -= ability.manaCost;
  actor.cooldowns[ability.id] = ability.cooldown;

  if (ability.kind === "heal") {
    const heal = Math.round((ability.baseDamage ?? 0) + (ability.scaling?.spellPower ?? 0) * actor.stats.spellPower);
    actor.hp = Math.min(actor.stats.maxHp, actor.hp + heal);
    state.log.push({ turn: state.turn, actor: actor.id, ability: ability.id, heal });
    return;
  }
  if (ability.kind === "buff" || ability.kind === "debuff") {
    const who = ability.targets === "self" ? actor : target;
    if (ability.effects) who.statuses.push(...ability.effects.map((e) => ({ ...e })));
    state.log.push({ turn: state.turn, actor: actor.id, target: who.id, ability: ability.id, applied: ability.effects, flavor: `${actor.name} применяет ${ability.name}` });
    return;
  }

  // damage
  const scale = (ability.scaling?.attack ?? 0) * actor.stats.attack + (ability.scaling?.spellPower ?? 0) * actor.stats.spellPower;
  const base = (ability.baseDamage ?? 0) + scale;
  const res = computeIncomingDamage(actor, target, base, ability.element, rng);
  if (res.dodged) {
    state.log.push({ turn: state.turn, actor: actor.id, target: target.id, ability: ability.id, dodged: true, flavor: `${target.name} уклоняется от ${ability.name}` });
    return;
  }
  target.hp -= res.dmg;
  // lifesteal
  if (actor.stats.lifesteal > 0) {
    const steal = Math.round(res.dmg * actor.stats.lifesteal);
    actor.hp = Math.min(actor.stats.maxHp, actor.hp + steal);
  }
  if (ability.effects && target.hp > 0) {
    target.statuses.push(...ability.effects.map((e) => ({ ...e })));
  }
  state.log.push({
    turn: state.turn,
    actor: actor.id,
    target: target.id,
    ability: ability.id,
    damage: res.dmg,
    crit: res.crit,
    blocked: res.blocked,
    applied: ability.effects,
    flavor: `${actor.name} → ${target.name}: ${ability.name} (${res.dmg}${res.crit ? " крит!" : ""}${res.blocked ? " блок" : ""})`,
  });
}
