import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";
import type { ItemSlot, RarityId, ItemInstance } from "@ton-abyss/shared";
import { ICONS, type IconName } from "./Icon.js";

const SLOT_ICON: Record<ItemSlot, IconName> = {
  weapon: "sword",
  offhand: "shield",
  head: "helm",
  chest: "chest",
  legs: "legs",
  hands: "gloves",
  feet: "boots",
  ring: "ring",
  amulet: "amulet",
  neck: "amulet",
  waist: "amulet",
  back: "cape",
  trinket: "trinket",
  relic: "relic",
  consumable: "potion",
  material: "essence",
  rune: "rune",
  pet_egg: "pet",
  key: "dungeons",
};

const WEAPON_ICON: Record<string, IconName> = {
  sword: "sword",
  greatsword: "sword",
  axe: "sword",
  mace: "hammer",
  hammer: "hammer",
  dagger: "dagger",
  bow: "bow",
  staff: "staff",
  wand: "staff",
  tome: "codex",
  claw: "dagger",
  spear: "dagger",
};

const RARITY_RU: Record<RarityId, string> = {
  common: "обычный",
  uncommon: "необычный",
  rare: "редкий",
  epic: "эпический",
  legendary: "легендарный",
  mythic: "мифический",
  abyssal: "абиссальный",
};

const STAT_RU: Record<string, string> = {
  attack: "Атака",
  spellPower: "Сила закл.",
  defense: "Защита",
  maxHp: "HP",
  maxMana: "Мана",
  critChance: "Крит. шанс",
  critMultiplier: "Крит. урон",
  dodge: "Уклонение",
  accuracy: "Точность",
  blockChance: "Блок-шанс",
  blockAmount: "Блок-сила",
  lifesteal: "Вампиризм",
  speed: "Скорость",
  luck: "Удача",
  strength: "Сила",
  agility: "Ловкость",
  intellect: "Интеллект",
  vitality: "Выносливость",
  spirit: "Дух",
  gold_find: "Золото %",
  xp_gain: "Опыт %",
  elemental_damage: "Стихия+",
};

function formatStatValue(stat: string, v: number): string {
  if (["critChance", "dodge", "accuracy", "blockChance", "lifesteal", "gold_find", "xp_gain"].includes(stat)) {
    return `${(v * 100).toFixed(1)}%`;
  }
  if (stat === "critMultiplier") return `+${(v * 100).toFixed(0)}%`;
  return `+${Math.round(v)}`;
}

export function LootReveal() {
  const lootReveal = useGame((s) => s.lootReveal);
  const dismiss = useGame((s) => s.dismissLootReveal);
  const [detail, setDetail] = useState<ItemInstance | null>(null);

  const hasAbyssal = lootReveal?.some((it) => it.rarity === "abyssal");
  const hasMythic = lootReveal?.some((it) => it.rarity === "mythic");
  const hasLegendary = lootReveal?.some((it) => it.rarity === "legendary");

  const headlineGradient = hasAbyssal
    ? "from-teal-200 via-cyan-300 to-teal-200"
    : hasMythic
    ? "from-rose-300 via-fuchsia-300 to-rose-300"
    : hasLegendary
    ? "from-amber-200 via-yellow-200 to-amber-200"
    : "from-white/90 via-white to-white/90";

  return (
    <AnimatePresence>
      {lootReveal && lootReveal.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={dismiss}
        >
          {/* Backdrop with pulse */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
          {(hasAbyssal || hasMythic) && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                background: hasAbyssal
                  ? "radial-gradient(600px circle at 50% 50%, rgba(20,241,193,0.18), transparent 60%)"
                  : "radial-gradient(600px circle at 50% 50%, rgba(244,63,94,0.18), transparent 60%)",
              }}
            />
          )}

          <motion.div
            initial={{ scale: 0.7, rotate: -2, y: 30 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="relative card p-5 max-w-md w-full text-center border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`font-display text-3xl tracking-widest mb-1 bg-gradient-to-r ${headlineGradient} bg-clip-text text-transparent`}>
              ДОБЫЧА
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/45 mb-4">
              {lootReveal.length} {lootReveal.length === 1 ? "предмет" : lootReveal.length < 5 ? "предмета" : "предметов"}
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
              {lootReveal.map((it, i) => {
                const base = ITEMS[it.baseId];
                if (!base) return null;
                const iconKey: IconName =
                  base.slot === "weapon" && base.weaponKind
                    ? WEAPON_ICON[base.weaponKind] ?? "sword"
                    : SLOT_ICON[base.slot] ?? "gem";
                const Icon = ICONS[iconKey];
                const isEpic = it.rarity === "legendary" || it.rarity === "mythic" || it.rarity === "abyssal";
                return (
                  <motion.div
                    key={it.uid}
                    initial={{ scale: 0, y: 20, rotateY: -80 }}
                    animate={{ scale: 1, y: 0, rotateY: 0 }}
                    transition={{
                      delay: i * 0.06,
                      type: "spring",
                      stiffness: 220,
                      damping: 18,
                    }}
                    data-rarity={it.rarity}
                    onClick={(ev) => { ev.stopPropagation(); setDetail(it); }}
                    className="relative card p-2.5 text-center rarity-gradient-border overflow-hidden min-h-[86px] cursor-pointer hover:scale-[1.03] transition-transform"
                  >
                    {isEpic && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        animate={{
                          boxShadow: [
                            "inset 0 0 8px var(--rc-glow)",
                            "inset 0 0 24px var(--rc-glow)",
                            "inset 0 0 8px var(--rc-glow)",
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className="mx-auto w-10 h-10 grid place-items-center rounded-lg mb-1"
                      style={{ color: "var(--rc)", background: "color-mix(in srgb, var(--rc) 10%, transparent)" }}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="text-[10px] font-bold rarity-text truncate leading-tight" title={base.name}>
                      {base.name}
                    </div>
                    <div className="text-[9px] text-white/55 capitalize mt-0.5">{RARITY_RU[it.rarity]}</div>

                    {/* Sparkle for legendary+ */}
                    {isEpic && (
                      <>
                        <motion.span
                          className="absolute top-1 right-1 text-[10px]"
                          style={{ color: "var(--rc)" }}
                          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
                        >
                          ✦
                        </motion.span>
                        <motion.span
                          className="absolute bottom-1 left-1 text-[8px]"
                          style={{ color: "var(--rc)" }}
                          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 + 0.3 }}
                        >
                          ✦
                        </motion.span>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Rarity summary */}
            <div className="mt-4 flex flex-wrap gap-1 justify-center">
              {(["abyssal", "mythic", "legendary", "epic", "rare", "uncommon", "common"] as RarityId[]).map((r) => {
                const n = lootReveal.filter((x) => x.rarity === r).length;
                if (n === 0) return null;
                return (
                  <div
                    key={r}
                    data-rarity={r}
                    className="rarity-text text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full border"
                    style={{ borderColor: "var(--rc)", background: "color-mix(in srgb, var(--rc) 10%, transparent)" }}
                  >
                    ×{n} {RARITY_RU[r]}
                  </div>
                );
              })}
            </div>

            <button className="btn-abyssal mt-4 w-full h-12 tracking-widest" onClick={dismiss}>
              ЗАБРАТЬ
            </button>

            <AnimatePresence>
              {detail && (() => {
                const base = ITEMS[detail.baseId];
                if (!base) return null;
                const baseStats = (base.baseStats ?? {}) as Record<string, number>;
                return (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(ev) => { ev.stopPropagation(); setDetail(null); }}
                    className="absolute inset-0 z-10 flex items-end sm:items-center justify-center p-3 bg-black/70 backdrop-blur-sm rounded-2xl"
                  >
                    <motion.div
                      initial={{ y: 30, scale: 0.95 }}
                      animate={{ y: 0, scale: 1 }}
                      exit={{ y: 30, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      onClick={(ev) => ev.stopPropagation()}
                      data-rarity={detail.rarity}
                      className="card p-4 w-full max-w-xs text-left rarity-gradient-border"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-lg grid place-items-center" style={{ color: "var(--rc)", background: "color-mix(in srgb, var(--rc) 10%, transparent)" }}>
                          {(() => {
                            const ik: IconName = base.slot === "weapon" && base.weaponKind ? (WEAPON_ICON[base.weaponKind] ?? "sword") : (SLOT_ICON[base.slot] ?? "gem");
                            const I = ICONS[ik]; return <I size={20} />;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-display text-sm rarity-text truncate">{base.name}</div>
                          <div className="text-[10px] text-white/55 capitalize">{RARITY_RU[detail.rarity]} · ур. {detail.level}{detail.upgradeLevel ? ` · +${detail.upgradeLevel}` : ""}</div>
                        </div>
                      </div>

                      {Object.keys(baseStats).length > 0 && (
                        <div className="text-[11px] space-y-0.5 mb-2">
                          {Object.entries(baseStats).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-white/65">{STAT_RU[k] ?? k}</span>
                              <span className="text-white">{formatStatValue(k, v as number)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {detail.affixes.length > 0 && (
                        <div className="text-[11px] space-y-0.5 mb-2 border-t border-white/10 pt-2">
                          {detail.affixes.map((a, ai) => (
                            <div key={ai} className="flex justify-between">
                              <span className="text-emerald-300/80">{STAT_RU[a.stat] ?? a.stat}{a.element ? ` (${a.element})` : ""}</span>
                              <span className="text-emerald-200">{formatStatValue(a.stat, a.value)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {base.flavor && <div className="text-[10px] italic text-white/45 mb-2">{base.flavor}</div>}

                      <button className="btn-ghost w-full text-xs" onClick={() => setDetail(null)}>Закрыть</button>
                    </motion.div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
