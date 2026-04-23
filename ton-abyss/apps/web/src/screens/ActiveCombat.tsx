import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useGame } from "../store.js";
import { ABILITIES, ITEMS } from "@ton-abyss/content";
import { CLASS_CONFIG } from "@ton-abyss/shared";

const CLASS_ABILITIES: Record<string, string[]> = {
  warden: ["basic_strike", "power_strike", "shield_wall", "heroic_strike", "whirlwind", "vengeance", "divine_shield"],
  runesmith: ["basic_strike", "rune_bolt", "rune_ignite", "fireball", "chain_lightning", "frost_nova", "meteor"],
  voidcaller: ["basic_strike", "void_drain", "void_curse", "soul_rip", "mark_of_death", "abyss_reap", "shadow_step"],
  beastbound: ["basic_strike", "beast_slash", "rally_pet", "execute", "berserk", "assassinate", "poison_dart"],
};

export function ActiveCombat() {
  const combat = useGame((s) => s.combat);
  const combatAction = useGame((s) => s.combatAction);
  const endCombatReturn = useGame((s) => s.endCombatReturn);
  const character = useGame((s) => s.character);
  const inventory = useGame((s) => s.inventory);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [combat?.log.length]);

  if (!combat || !character) return null;

  const abilityIds = CLASS_ABILITIES[character.classId] ?? ["basic_strike"];
  const consumables = inventory.filter((i) => ITEMS[i.baseId]?.slot === "consumable");

  const playerPct = combat.player.hp / combat.player.maxHp;
  const manaPct = combat.player.mana / combat.player.maxMana;
  const enemyPct = combat.enemy.hp / combat.enemy.maxHp;

  return (
    <div className="px-4 py-4 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="font-display text-lg tracking-wider">Бой</div>
        <div className="text-xs text-white/60">Комната {combat.room}/{combat.totalRooms} {combat.isBossRoom && "· 🔥 БОСС"}</div>
      </div>

      {/* Enemy card */}
      <motion.div layout className={`card relative overflow-hidden p-4 ${combat.isBossRoom ? "border-2 border-red-500/60 shadow-[0_0_24px_rgba(239,68,68,0.5)]" : ""}`}>
        <div className="flex items-center gap-3">
          <div className={`text-5xl ${combat.isBossRoom ? "drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" : ""}`}>
            {combat.isBossRoom ? "👹" : "👿"}
          </div>
          <div className="flex-1">
            <div className="font-display text-xl tracking-wider text-red-300">{combat.enemy.name}</div>
            <div className="text-[11px] text-white/60">{combat.enemyDef.archetype ?? "враг"} · ур. {combat.enemyDef.level}</div>
          </div>
          <div className="text-right text-xs">
            HP {Math.floor(combat.enemy.hp)} / {combat.enemy.maxHp}
          </div>
        </div>
        <div className="h-3 bg-black/60 rounded-full overflow-hidden mt-3 border border-red-500/20">
          <motion.div animate={{ width: `${enemyPct * 100}%` }} className="h-full bg-gradient-to-r from-red-500 via-red-600 to-rose-500" />
        </div>
        {combat.enemy.statuses.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {combat.enemy.statuses.map((s, i) => (
              <span key={i} className="chip bg-yellow-500/20 text-yellow-200 border border-yellow-500/40 text-[10px]">
                {s.id} {s.duration}т
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Player card */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl" style={{ filter: `drop-shadow(0 0 8px ${CLASS_CONFIG[character.classId].color})` }}>
            {CLASS_CONFIG[character.classId].emoji}
          </div>
          <div className="flex-1">
            <div className="font-display text-lg tracking-wider" style={{ color: CLASS_CONFIG[character.classId].color }}>
              {CLASS_CONFIG[character.classId].name}
            </div>
            <div className="text-[11px] text-white/60">ур. {character.level}</div>
          </div>
          <div className="text-right text-xs">
            <div>HP {Math.floor(combat.player.hp)}/{combat.player.maxHp}</div>
            <div className="text-cyan-300">MP {Math.floor(combat.player.mana)}/{combat.player.maxMana}</div>
          </div>
        </div>
        <div className="h-3 bg-black/60 rounded-full overflow-hidden mt-3 border border-emerald-500/20">
          <motion.div animate={{ width: `${playerPct * 100}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-green-400" />
        </div>
        <div className="h-2 bg-black/60 rounded-full overflow-hidden mt-1 border border-cyan-500/20">
          <motion.div animate={{ width: `${manaPct * 100}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-400" />
        </div>
        {combat.player.statuses.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {combat.player.statuses.map((s, i) => (
              <span key={i} className="chip bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 text-[10px]">
                {s.id} {s.duration}т
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Log */}
      <div ref={logRef} className="card p-3 h-40 overflow-y-auto text-[11px] space-y-1">
        <AnimatePresence initial={false}>
          {combat.log.slice(-30).map((e, i) => (
            <motion.div
              key={`${e.turn}-${i}-${e.text.slice(0, 10)}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={
                e.tone === "epic" ? "text-amber-300 font-bold" :
                e.tone === "good" ? "text-emerald-300" :
                e.tone === "bad" ? "text-red-300" :
                "text-white/70"
              }
            >
              T{e.turn} · {e.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      {!combat.ended ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-primary" onClick={() => combatAction("basic")}>⚔️ Атака</button>
            <button className="btn-ghost" onClick={() => combatAction("flee")}>🏃 Бежать</button>
          </div>
          <div>
            <div className="panel-title mb-1">Способности</div>
            <div className="grid grid-cols-2 gap-2">
              {abilityIds.map((abid) => {
                const a = ABILITIES[abid];
                if (!a) return null;
                const cd = combat.player.abilityCooldowns[abid] ?? 0;
                const disabled = cd > 0 || combat.player.mana < a.manaCost;
                return (
                  <button
                    key={abid}
                    disabled={disabled}
                    onClick={() => combatAction("ability", { abilityId: abid })}
                    className={`card p-2 text-left text-[11px] ${disabled ? "opacity-50" : "hover:bg-white/5"}`}
                  >
                    <div className="font-bold text-white/90">{a.name}</div>
                    <div className="text-white/60 text-[10px]">
                      💧{a.manaCost} · CD {a.cooldown}{cd > 0 ? ` (–${cd}т)` : ""}
                    </div>
                    <div className="text-white/50 text-[10px]">{a.description?.slice(0, 40)}</div>
                  </button>
                );
              })}
            </div>
          </div>
          {consumables.length > 0 && (
            <div>
              <div className="panel-title mb-1">Предметы</div>
              <div className="flex flex-wrap gap-2">
                {consumables.slice(0, 8).map((it) => {
                  const base = ITEMS[it.baseId]!;
                  return (
                    <button
                      key={it.uid}
                      onClick={() => combatAction("consumable", { itemUid: it.uid })}
                      className="chip bg-red-900/40 border border-red-400/40 text-red-200 text-[10px]"
                    >
                      🧪 {base.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`card p-5 text-center ${combat.victory ? "border-emerald-400/60" : "border-red-400/60"}`}
        >
          <div className="text-3xl mb-2">{combat.victory ? "🏆" : "💀"}</div>
          <div className="text-xl font-display tracking-wider">
            {combat.victory ? "Победа!" : "Поражение"}
          </div>
          <div className="text-xs text-white/70 mt-2">
            {combat.victory
              ? `+${combat.aggregatedXp} XP, +${combat.aggregatedGold} 💰, лута: ${combat.aggregatedLoot.length}`
              : "Хардкор не прощает. Потеря 25% золота."}
          </div>
          <button className="btn-primary mt-4" onClick={endCombatReturn}>Вернуться домой</button>
        </motion.div>
      )}
    </div>
  );
}
