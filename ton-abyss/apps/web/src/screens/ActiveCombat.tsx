import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "../store.js";
import { ABILITIES, ITEMS } from "@ton-abyss/content";
import { CLASS_META, WEAPON_KINDS } from "@ton-abyss/shared";
import { ClassPortrait } from "../components/ClassPortrait.js";
import { ICONS } from "../components/Icon.js";
import { CreatureSprite } from "../components/CreatureSprite.js";

const CLASS_FALLBACK_ABILITIES: Record<string, string[]> = {
  warden: ["basic_strike", "power_strike", "shield_wall"],
  runesmith: ["basic_strike", "rune_bolt", "rune_ignite"],
  voidcaller: ["basic_strike", "void_drain", "void_curse"],
  beastbound: ["basic_strike", "beast_slash", "rally_pet"],
};

type DmgPop = { id: number; text: string; tone: "player" | "enemy" | "crit" | "heal"; x: number };

export function ActiveCombat() {
  const combat = useGame((s) => s.combat);
  const combatAction = useGame((s) => s.combatAction);
  const endCombatReturn = useGame((s) => s.endCombatReturn);
  const character = useGame((s) => s.character);
  const inventory = useGame((s) => s.inventory);
  const equipped = useGame((s) => s.equipped);
  const logRef = useRef<HTMLDivElement>(null);
  const prevEnemyHp = useRef<number | null>(null);
  const prevPlayerHp = useRef<number | null>(null);
  const [dmgPops, setDmgPops] = useState<DmgPop[]>([]);
  const [shake, setShake] = useState<null | "player" | "enemy">(null);
  const [enemyAnim, setEnemyAnim] = useState<"idle" | "hit" | "attack" | "telegraph" | "death">("idle");
  const popIdRef = useRef(0);

  const meta = character ? CLASS_META[character.classId] : null;

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [combat?.log.length]);

  useEffect(() => {
    if (!combat) return;
    if (prevEnemyHp.current !== null && combat.enemy.hp < prevEnemyHp.current) {
      const dmg = Math.round(prevEnemyHp.current - combat.enemy.hp);
      const lastLog = combat.log[combat.log.length - 1];
      const isCrit = lastLog?.text?.toLowerCase().includes("крит");
      pushPop(`-${dmg}`, isCrit ? "crit" : "enemy");
      setShake("enemy");
      setEnemyAnim(combat.enemy.hp <= 0 ? "death" : "hit");
      setTimeout(() => {
        setShake(null);
        setEnemyAnim((a) => (a === "death" ? "death" : "idle"));
      }, 350);
    }
    prevEnemyHp.current = combat.enemy.hp;

    if (prevPlayerHp.current !== null && combat.player.hp < prevPlayerHp.current) {
      const dmg = Math.round(prevPlayerHp.current - combat.player.hp);
      pushPop(`-${dmg}`, "player");
      setShake("player");
      // enemy just attacked us — run attack animation briefly
      setEnemyAnim((a) => (a === "death" ? a : "attack"));
      setTimeout(() => {
        setShake(null);
        setEnemyAnim((a) => (a === "death" ? a : "idle"));
      }, 550);
    } else if (prevPlayerHp.current !== null && combat.player.hp > prevPlayerHp.current) {
      const heal = Math.round(combat.player.hp - prevPlayerHp.current);
      pushPop(`+${heal}`, "heal");
    }
    prevPlayerHp.current = combat.player.hp;
  }, [combat?.enemy.hp, combat?.player.hp]);

  function pushPop(text: string, tone: DmgPop["tone"]) {
    const id = ++popIdRef.current;
    const x = 50 + (Math.random() - 0.5) * 30;
    setDmgPops((prev) => [...prev, { id, text, tone, x }]);
    setTimeout(() => setDmgPops((prev) => prev.filter((p) => p.id !== id)), 1100);
  }

  const consumables = useMemo(
    () => (inventory ? inventory.filter((i) => ITEMS[i.baseId]?.slot === "consumable") : []),
    [inventory]
  );

  if (!combat || !character || !meta) return null;

  // Weapon-locked moveset: abilities come from equipped weapon's WeaponKind.
  const equippedWpnUid = equipped["weapon"];
  const equippedWpn = equippedWpnUid ? inventory.find((i) => i.uid === equippedWpnUid) : null;
  const equippedWpnKind = equippedWpn ? ITEMS[equippedWpn.baseId]?.weaponKind : undefined;
  const weaponMeta = equippedWpnKind ? WEAPON_KINDS[equippedWpnKind] : null;
  const abilityIds = weaponMeta?.abilities ?? CLASS_FALLBACK_ABILITIES[character.classId] ?? ["basic_strike"];

  const playerPct = combat.player.hp / combat.player.maxHp;
  const manaPct = combat.player.mana / combat.player.maxMana;
  const enemyPct = combat.enemy.hp / combat.enemy.maxHp;

  return (
    <div className="px-4 py-4 space-y-3 pb-32">
      <div className="flex items-center justify-between">
        <div className="font-display text-2xl tracking-widest uppercase text-gradient-danger">Бой</div>
        <div className="text-xs text-white/60 flex items-center gap-2">
          <span>Комната {combat.room}/{combat.totalRooms}</span>
          {combat.isBossRoom && (
            <span className="chip-danger flex items-center gap-1">
              <ICONS.skull size={12} /> БОСС
            </span>
          )}
        </div>
      </div>

      {/* Enemy cinematic stage */}
      <motion.div
        layout
        animate={shake === "enemy" ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
        transition={{ duration: 0.25 }}
        className={`relative overflow-hidden rounded-2xl border ${
          combat.isBossRoom
            ? "border-red-500/50 bg-gradient-to-b from-red-950/80 via-red-950/30 to-red-950/10 shadow-[0_0_40px_-10px_rgba(239,68,68,0.6)]"
            : "border-red-500/20 bg-gradient-to-b from-red-950/45 via-red-950/15 to-transparent"
        }`}
      >
        {/* animated background haze */}
        <motion.div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: combat.isBossRoom ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.15)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: combat.isBossRoom ? "rgba(217,70,239,0.22)" : "rgba(217,70,239,0.12)" }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* floor line */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* arena name strip */}
        <div className="relative flex items-center justify-between gap-2 px-4 pt-3">
          <div className="min-w-0">
            <div className="font-display text-lg sm:text-xl tracking-wider text-red-200 truncate drop-shadow-[0_2px_6px_rgba(239,68,68,0.6)]">
              {combat.enemy.name}
            </div>
            <div className="text-[10px] text-white/60 capitalize tracking-widest">
              {combat.enemyDef.archetype ?? "враг"} · ур. {combat.enemyDef.level} · {combat.enemyDef.element}
            </div>
          </div>
          <div className="text-right text-[11px] shrink-0">
            <div className="text-white/40 text-[9px] tracking-widest">ЗДОРОВЬЕ</div>
            <div className="font-mono font-bold tabular-nums text-red-200">
              {Math.max(0, Math.floor(combat.enemy.hp))} / {combat.enemy.maxHp}
            </div>
          </div>
        </div>

        {/* big animated creature */}
        <div className="relative flex items-end justify-center pt-2 pb-4 min-h-[200px] overflow-hidden">
          <CreatureSprite
            archetype={combat.enemyDef.archetype}
            element={combat.enemyDef.element}
            size="lg"
            state={enemyAnim}
            isBoss={!!combat.isBossRoom}
          />
          {/* telegraph flash overlay when enemy attacks */}
          <AnimatePresence>
            {enemyAnim === "attack" && (
              <motion.div
                key="atk-flash"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.6, 2] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55 }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(239,68,68,0.5) 0%, transparent 65%)",
                }}
              />
            )}
          </AnimatePresence>
          {/* damage pops over creature */}
          <AnimatePresence>
            {dmgPops
              .filter((p) => p.tone === "enemy" || p.tone === "crit")
              .map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 0, scale: 0.7 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [-10, -40, -70, -100],
                    scale: p.tone === "crit" ? [0.7, 1.8, 1.3, 1] : [0.7, 1.3, 1.1, 0.9],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1 }}
                  className={`absolute pointer-events-none font-display font-bold tabular-nums ${
                    p.tone === "crit" ? "text-4xl text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" : "text-2xl text-red-300 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]"
                  }`}
                  style={{ left: `${p.x}%`, top: "50%" }}
                >
                  {p.text}
                  {p.tone === "crit" && "!"}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <div className="relative px-4 pb-4">

        <div className="h-3 bg-black/60 rounded-full overflow-hidden mt-3 border border-red-500/30 relative">
          <motion.div
            animate={{ width: `${Math.max(0, enemyPct * 100)}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-red-400"
          />
          <div className="absolute inset-0 rarity-shimmer opacity-40" />
          {/* phase chunks — 25/50/75 breakpoints (boss only) */}
          {combat.isBossRoom && [25, 50, 75].map((p) => (
            <div
              key={p}
              className="absolute top-0 bottom-0 w-px bg-black/80"
              style={{ left: `${p}%`, boxShadow: "0 0 0 1px rgba(255,255,255,0.1)" }}
            />
          ))}
        </div>

        {combat.enemy.statuses.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {combat.enemy.statuses.map((s, i) => (
              <span key={i} className="chip bg-yellow-500/20 text-yellow-200 border-yellow-500/40 text-[10px] border">
                {s.id} · {s.duration}т
              </span>
            ))}
          </div>
        )}
        </div>
      </motion.div>

      {/* Player card with shake */}
      <motion.div
        animate={shake === "player" ? { x: [0, -4, 4, -3, 3, 0] } : undefined}
        transition={{ duration: 0.25 }}
        className="relative rounded-2xl p-4 border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent overflow-hidden"
      >
        <div
          className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ background: meta.palette }}
        />
        <div className="flex items-center gap-3 relative">
          <div className="shrink-0">
            <ClassPortrait classId={character.classId} size={56} animated={false} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg tracking-wider truncate" style={{ color: meta.palette }}>
              {meta.name}
            </div>
            <div className="text-[11px] text-white/60">ур. {character.level}</div>
          </div>
          <div className="text-right text-[11px]">
            <div className="flex items-center gap-1 justify-end text-emerald-300 font-mono tabular-nums">
              <ICONS.heart size={12} /> {Math.max(0, Math.floor(combat.player.hp))}/{combat.player.maxHp}
            </div>
            <div className="flex items-center gap-1 justify-end text-cyan-300 font-mono tabular-nums">
              <ICONS.mana size={12} /> {Math.floor(combat.player.mana)}/{combat.player.maxMana}
            </div>
          </div>
        </div>

        <div className="h-3 bg-black/60 rounded-full overflow-hidden mt-3 border border-emerald-500/20">
          <motion.div
            animate={{ width: `${Math.max(0, playerPct * 100)}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400"
          />
        </div>
        <div className="h-2 bg-black/60 rounded-full overflow-hidden mt-1 border border-cyan-500/20">
          <motion.div
            animate={{ width: `${Math.max(0, manaPct * 100)}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-400"
          />
        </div>

        {combat.player.statuses.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {combat.player.statuses.map((s, i) => (
              <span key={i} className="chip bg-cyan-500/20 text-cyan-200 border-cyan-500/40 text-[10px] border">
                {s.id} · {s.duration}т
              </span>
            ))}
          </div>
        )}

        <AnimatePresence>
          {dmgPops
            .filter((p) => p.tone === "player" || p.tone === "heal")
            .map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 0, scale: 0.7 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [-5, -30, -50, -70],
                  scale: [0.7, 1.2, 1, 0.9],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1 }}
                className={`absolute pointer-events-none font-display font-bold text-xl tabular-nums ${
                  p.tone === "heal" ? "text-emerald-300" : "text-red-300"
                }`}
                style={{ left: `${p.x}%`, top: "40%" }}
              >
                {p.text}
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Log */}
      <div
        ref={logRef}
        className="card p-3 h-32 overflow-y-auto text-[11px] space-y-1 font-mono"
        style={{ scrollbarGutter: "stable" }}
      >
        <AnimatePresence initial={false}>
          {combat.log.slice(-40).map((e, i) => (
            <motion.div
              key={`${e.turn}-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className={
                e.tone === "epic" ? "text-amber-300 font-bold" :
                e.tone === "good" ? "text-emerald-300" :
                e.tone === "bad"  ? "text-red-300" :
                "text-white/70"
              }
            >
              <span className="text-white/30">T{e.turn}</span> · {e.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      {!combat.ended ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-primary h-12" onClick={() => combatAction("basic")}>
              <ICONS.sword size={18} /> Атака
            </button>
            <button className="btn-ghost h-12" onClick={() => combatAction("flee")}>
              🏃 Бежать
            </button>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1.5 px-1">
              <div className="section-title text-sm">Способности оружия</div>
              {weaponMeta && (
                <div className="text-[10px] text-amber-300/80">
                  {weaponMeta.ru} · {weaponMeta.range === "melee" ? "ближний" : weaponMeta.range === "ranged" ? "дальний" : "магия"} · {weaponMeta.hands}-руч.
                </div>
              )}
              {!weaponMeta && (
                <div className="text-[10px] text-rose-400/80">Без оружия — базовый набор</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {abilityIds.map((abid) => {
                const a = ABILITIES[abid];
                if (!a) return null;
                const cd = combat.player.abilityCooldowns[abid] ?? 0;
                const disabled = cd > 0 || combat.player.mana < a.manaCost;
                const cdPct = cd > 0 ? Math.min(1, cd / a.cooldown) : 0;
                return (
                  <button
                    key={abid}
                    disabled={disabled}
                    onClick={() => combatAction("ability", { abilityId: abid })}
                    className={`relative overflow-hidden card p-2 text-left text-[11px] border press ${
                      disabled
                        ? "opacity-55 border-white/5"
                        : "border-abyss-500/30 hover:border-abyss-500/60 hover:bg-abyss-500/5"
                    } transition`}
                  >
                    {/* radial cooldown sweep */}
                    {cdPct > 0 && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `conic-gradient(from -90deg, rgba(20,241,193,0.18) ${(1 - cdPct) * 360}deg, rgba(0,0,0,0.55) ${(1 - cdPct) * 360}deg)`,
                        }}
                      />
                    )}
                    <div className="relative font-bold text-white/95 flex items-center gap-1.5">
                      <ICONS.spell size={12} style={{ color: meta.palette }} />
                      {a.name}
                    </div>
                    <div className="relative text-white/60 text-[10px] flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <ICONS.mana size={10} /> {a.manaCost}
                      </span>
                      <span className="tabular-nums">CD {a.cooldown}{cd > 0 ? ` (−${cd}т)` : ""}</span>
                    </div>
                    {a.description && (
                      <div className="relative text-white/50 text-[10px] mt-0.5 line-clamp-2">{a.description}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {consumables.length > 0 && (
            <div>
              <div className="section-title mb-1.5 px-1 text-sm">Предметы</div>
              <div className="flex flex-wrap gap-2">
                {consumables.slice(0, 8).map((it) => {
                  const base = ITEMS[it.baseId]!;
                  return (
                    <button
                      key={it.uid}
                      onClick={() => combatAction("consumable", { itemUid: it.uid })}
                      className="chip bg-red-900/30 border border-red-400/40 text-red-200 text-[10px] hover:bg-red-900/50 flex items-center gap-1"
                    >
                      <ICONS.potion size={12} /> {base.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={`card p-5 text-center border-2 ${
            combat.victory ? "border-emerald-400/60 shadow-[0_0_40px_-10px_rgba(74,222,128,0.5)]" : "border-red-500/60 shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)]"
          }`}
        >
          <div className="text-5xl mb-2">{combat.victory ? "🏆" : "💀"}</div>
          <div className={`text-2xl font-display tracking-widest uppercase ${combat.victory ? "text-gradient-gold" : "text-gradient-danger"}`}>
            {combat.victory ? "Победа" : "Поражение"}
          </div>
          <div className="text-xs text-white/70 mt-3">
            {combat.victory ? (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="chip-success">+{combat.aggregatedXp} XP</span>
                <span className="chip-accent">+{combat.aggregatedGold} золота</span>
                <span className="chip">лут: {combat.aggregatedLoot.length}</span>
              </div>
            ) : (
              <span className="chip-danger">Потери масштабируются с уровнем персонажа.</span>
            )}
          </div>
          <button className="btn-abyssal mt-4 h-12 w-full tracking-widest" onClick={endCombatReturn}>
            ВЕРНУТЬСЯ
          </button>
        </motion.div>
      )}
    </div>
  );
}

function EnemyPortrait({ isBoss }: { isBoss: boolean }) {
  const color = isBoss ? "#f43f5e" : "#fca5a5";
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
      <defs>
        <radialGradient id="eg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="28" cy="28" r="26" fill="url(#eg1)">
        {isBoss && <animate attributeName="r" values="24;28;24" dur="2s" repeatCount="indefinite" />}
      </circle>
      {/* Head */}
      <path d="M14 30 Q14 14 28 14 Q42 14 42 30 L40 40 Q34 44 28 44 Q22 44 16 40 Z" fill={color} opacity="0.85" />
      {/* Horns */}
      <path d="M18 18 Q14 8 20 10 M38 18 Q42 8 36 10" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="22" cy="28" r="2" fill="#000" />
      <circle cx="34" cy="28" r="2" fill="#000" />
      <circle cx="22.5" cy="27.5" r="0.8" fill="#fff" opacity="0.8" />
      <circle cx="34.5" cy="27.5" r="0.8" fill="#fff" opacity="0.8" />
      {/* Mouth */}
      <path d="M22 36 L25 38 L28 36 L31 38 L34 36" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      {/* Fangs */}
      <path d="M24 36 L24.5 40 L25 36 M31 36 L31.5 40 L32 36" fill="#fff" />
    </svg>
  );
}
