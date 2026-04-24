import { motion } from "framer-motion";
import { useGame, useDerivedStats } from "../store.js";
import { CLASS_META, STAT_LABEL } from "@ton-abyss/shared";
import type { StatId } from "@ton-abyss/shared";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { ClassPortrait } from "../components/ClassPortrait.js";
import { ICONS, type IconName } from "../components/Icon.js";

import type { Screen } from "../store.js";

type Tile = { id: Screen; label: string; icon: IconName; hint: string; accent: string };
type MenuGroup = { key: string; title: string; icon: IconName; tint: string; tiles: Tile[] };

const MENU: MenuGroup[] = [
  {
    key: "combat", title: "Бой", icon: "skull", tint: "#f43f5e",
    tiles: [
      { id: "tower",       label: "Башня",   icon: "tower",    hint: "∞ этажей",     accent: "#e879f9" },
      { id: "arena",       label: "Арена",   icon: "arena",    hint: "PvP ELO",      accent: "#fb7185" },
      { id: "hunts",       label: "Охота",   icon: "hunt",     hint: "Редкие цели",  accent: "#22d3ee" },
      { id: "clan_bosses", label: "Клан-боссы", icon: "skull",  hint: "Рейды клана",  accent: "#fb7185" },
      { id: "echo_rifts",  label: "Эхо-Рифты",  icon: "gem",    hint: "Эндгейм, аффиксы", accent: "#d946ef" },
      { id: "world_boss",  label: "Мировой босс", icon: "skull", hint: "Групповой рейд 24ч", accent: "#ef4444" },
    ],
  },
  {
    key: "activities", title: "Досуг", icon: "quest", tint: "#38bdf8",
    tiles: [
      { id: "fishing",   label: "Рыбалка",       icon: "quest",       hint: "−2 энергии, лут", accent: "#38bdf8" },
      { id: "gathering", label: "Собирательство",icon: "quest",       hint: "−4 энергии, 4 биома", accent: "#22c55e" },
      { id: "journal",   label: "Журнал",        icon: "codex",       hint: "Лента событий",   accent: "#a855f7" },
      { id: "loadouts",  label: "Комплекты",     icon: "bag",         hint: "4 слота экипа",   accent: "#06b6d4" },
    ],
  },
  {
    key: "gear", title: "Снаряжение", icon: "anvil", tint: "#f59e0b",
    tiles: [
      { id: "inventory",   label: "Инвентарь", icon: "bag",     hint: "Экипировка",        accent: "#a3e635" },
      { id: "stash",       label: "Стэш",      icon: "stash",   hint: "6 вкладок",          accent: "#94a3b8" },
      { id: "crafting",    label: "Кузня",     icon: "anvil",   hint: "Крафт, +15",         accent: "#f59e0b" },
      { id: "blueprints",  label: "Блюпринты", icon: "codex",   hint: "Все рецепты, статус",accent: "#a855f7" },
      { id: "forge_stations", label: "Кузни Бездны", icon: "anvil", hint: "Стихийные кузни", accent: "#f97316" },
      { id: "enchanting",  label: "Чарование", icon: "enchant", hint: "Эссенции, рунворды", accent: "#f472b6" },
      { id: "sockets",     label: "Гнёзда",    icon: "socket",  hint: "Гемы, перековка",    accent: "#c084fc" },
      { id: "skill_tree",  label: "Навыки",    icon: "tree",    hint: "Дерево умений",      accent: "#14f1c1" },
    ],
  },
  {
    key: "companions", title: "Соратники", icon: "pet", tint: "#fb7185",
    tiles: [
      { id: "pets",        label: "Питомцы",    icon: "pet",        hint: "Эволюция, слияние", accent: "#fb7185" },
      { id: "expeditions", label: "Экспедиции", icon: "expedition", hint: "Авто-квесты",       accent: "#fbbf24" },
      { id: "mounts",      label: "Скакуны",    icon: "mount",      hint: "Транспорт",         accent: "#fde047" },
    ],
  },
  {
    key: "quests", title: "Задания", icon: "quest", tint: "#84cc16",
    tiles: [
      { id: "quests",       label: "Квесты",  icon: "quest",       hint: "Кампания",    accent: "#84cc16" },
      { id: "bounties",     label: "Баунти",  icon: "bounty",      hint: "Дневные",     accent: "#a3e635" },
      { id: "achievements", label: "Ачивки",  icon: "achievement", hint: "Титулы, AP",  accent: "#fcd34d" },
    ],
  },
  {
    key: "social", title: "Социальное", icon: "clan", tint: "#f0abfc",
    tiles: [
      { id: "clan",        label: "Клан",     icon: "clan",        hint: "Войны, банк",   accent: "#f0abfc" },
      { id: "factions",    label: "Фракции",  icon: "faction",     hint: "Репутация",     accent: "#c084fc" },
      { id: "leaderboard", label: "Топ",      icon: "leaderboard", hint: "Рейтинг мира",  accent: "#fde047" },
    ],
  },
  {
    key: "economy", title: "Экономика", icon: "shop", tint: "#fbbf24",
    tiles: [
      { id: "market",     label: "Маркет",      icon: "shop",        hint: "Купля/продажа",   accent: "#fbbf24" },
      { id: "auction",    label: "Аукцион",     icon: "achievement", hint: "Ставки, выкуп",   accent: "#d946ef" },
      { id: "trade_post", label: "Торг. пост",  icon: "shop",        hint: "NPC-обмен",       accent: "#22d3ee" },
      { id: "shop",       label: "Лавка",       icon: "shop",        hint: "Продать/купить",  accent: "#94a3b8" },
      { id: "lootboxes",  label: "Сундуки",     icon: "achievement", hint: "Pity, лут",       accent: "#fb923c" },
    ],
  },
  {
    key: "world", title: "Мир и прогресс", icon: "relic", tint: "#d6bcfa",
    tiles: [
      { id: "relics",     label: "Реликвии",   icon: "relic",       hint: "Перман. бонусы", accent: "#d6bcfa" },
      { id: "codex",      label: "Кодекс",     icon: "codex",       hint: "Гид по миру",    accent: "#a78bfa" },
      { id: "battlepass", label: "Боевой Пропуск", icon: "achievement", hint: "Сезон, награды", accent: "#fbbf24" },
    ],
  },
];

function DailyRewardsBanner() {
  const dr = useGame((s) => s.dailyRewards);
  const claim = useGame((s) => s.claimDailyReward);
  if (dr.claimedToday) return null;
  return (
    <motion.button
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => claim()}
      className="w-full flex items-center justify-between gap-3 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-amber-500/5 px-3 py-2 hover:from-amber-500/30 transition-all"
    >
      <div className="text-left">
        <div className="text-amber-200 font-display text-sm">🎁 Ежедневная награда</div>
        <div className="text-[10px] text-white/65">День {dr.currentDay + 1} из 7 — нажмите, чтобы получить</div>
      </div>
      <div className="text-amber-300 text-xs font-bold animate-pulse">Забрать</div>
    </motion.button>
  );
}


export function Home() {
  const char = useGame((s) => s.character)!;
  const setScreen = useGame((s) => s.setScreen);
  const derived = useDerivedStats()!;
  const wallet = useTonWallet();
  const meta = CLASS_META[char.classId];
  const primary: StatId[] = ["strength", "agility", "intellect", "vitality", "spirit", "luck"];

  return (
    <div className="px-4 pt-3 pb-24 section-gap-lg page-in">
      <DailyRewardsBanner />
      {/* Quick-action bar — hero CTAs */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setScreen("world_map")}
          className="cta-hero-abyss text-left"
          style={{ minHeight: 92 }}
        >
          <div className="absolute -right-4 -bottom-8 w-36 h-36 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background: "#60a5fa" }} />
          <div className="flex items-center gap-3 relative">
            <div className="w-12 h-12 rounded-xl grid place-items-center border" style={{ color: "#60a5fa", background: "linear-gradient(135deg,#60a5fa33,transparent)", borderColor: "#60a5fa66" }}>
              <ICONS.map size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-display text-white leading-none">Карта</div>
              <div className="text-caption text-white/70 mt-1">Акты · биомы · боссы</div>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setScreen("dungeon_list")}
          className="cta-hero-danger text-left"
          style={{ minHeight: 92 }}
        >
          <div className="absolute -right-4 -bottom-8 w-36 h-36 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background: "#f43f5e" }} />
          <div className="flex items-center gap-3 relative">
            <div className="w-12 h-12 rounded-xl grid place-items-center border" style={{ color: "#f43f5e", background: "linear-gradient(135deg,#f43f5e33,transparent)", borderColor: "#f43f5e66" }}>
              <ICONS.dungeons size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-display text-white leading-none">Данжи</div>
              <div className="text-caption text-white/70 mt-1">Боссы · лут · XP</div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Hero header — class portrait + vitals */}
      <div className="hero-card">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-60" style={{ background: meta.palette }} />
            <div className="relative">
              <ClassPortrait classId={char.classId} size={96} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-3xl tracking-wider leading-none" style={{ color: meta.palette }}>
              {meta.name}
            </div>
            <div className="text-xs text-white/60 mt-0.5">{meta.tagline}</div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="chip-accent">Ур. {char.level}</span>
              <span className="chip-danger flex items-center gap-1">
                <ICONS.skull size={12} /> Хардкор
              </span>
              {char.deepestFloor > 0 && <span className="chip">T{char.deepestFloor}</span>}
              {char.deaths > 0 && (
                <span className="chip-danger flex items-center gap-1">
                  <ICONS.skull size={12} /> {char.deaths}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* HP/Mana */}
        <div className="mt-4 space-y-2">
          <Bar icon="heart" label="Жизнь" value={char.hpCurrent} max={derived.maxHp} color="from-red-500 to-red-700" />
          <Bar icon="mana"  label="Мана"  value={char.manaCurrent} max={derived.maxMana} color="from-abyss-300 to-abyss-500" />
        </div>

        {/* Resources strip */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResourceChip icon="gold"  value={char.gold}      label="Золото"  tint="#f59e0b" />
          <ResourceChip icon="shard" value={char.shards}    label="Шарды"   tint="#14f1c1" />
          <ResourceChip icon="dust"  value={char.abyssDust} label="Пыль"    tint="#c084fc" />
        </div>

        {char.unspentPoints > 0 && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="mt-3 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-200 flex items-center gap-2"
          >
            <span className="text-base">⚡</span>
            Нераспределённые очки характеристик: <b>{char.unspentPoints}</b>
          </motion.div>
        )}
      </div>

      {/* Primary stats */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="section-title">Характеристики</div>
          {char.unspentPoints > 0 && (
            <div className="chip-accent">+{char.unspentPoints} оч.</div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {primary.map((s) => (
            <StatRow key={s} stat={s} value={char.stats[s]} canSpend={char.unspentPoints > 0} />
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-white/70">
          <KV icon="attack"  k="Атака"        v={derived.attack} />
          <KV icon="spell"   k="Магия"        v={derived.spellPower} />
          <KV icon="defense" k="Защита"       v={derived.defense} />
          <KV icon="speed"   k="Скорость"     v={derived.speed.toFixed(0)} />
          <KV icon="crit"    k="Крит. шанс"   v={`${(derived.critChance * 100).toFixed(1)}%`} />
          <KV icon="crit"    k="Крит. множ."  v={`×${derived.critMultiplier.toFixed(2)}`} />
          <KV icon="dodge"   k="Уклонение"    v={`${(derived.dodge * 100).toFixed(1)}%`} />
          <KV icon="shield"  k="Блок"         v={`${(derived.blockChance * 100).toFixed(1)}%`} />
        </div>
      </div>

      {/* Menu by category */}
      {MENU.map((group) => {
        const GroupIcon = ICONS[group.icon];
        return (
          <div key={group.key} className="space-y-2">
            <div className="flex items-center gap-2.5 px-1">
              <div
                className="w-7 h-7 rounded-lg grid place-items-center border"
                style={{
                  background: `linear-gradient(135deg, ${group.tint}28, transparent)`,
                  borderColor: `${group.tint}44`,
                  color: group.tint,
                }}
              >
                <GroupIcon size={16} />
              </div>
              <h3 className="font-display text-lg tracking-widest uppercase text-white/85">
                {group.title}
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
              <span className="text-[10px] text-white/40 uppercase tracking-widest">
                {group.tiles.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 stagger-in">
              {group.tiles.map((t) => {
                const TileIcon = ICONS[t.icon];
                return (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setScreen(t.id)}
                    className="card-elevated tile-lift p-3 relative overflow-hidden text-left flex items-center gap-3"
                  >
                    <div
                      className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl opacity-30 pointer-events-none"
                      style={{ background: t.accent }}
                    />
                    <div
                      className="shrink-0 w-10 h-10 rounded-xl grid place-items-center border relative z-10"
                      style={{
                        color: t.accent,
                        background: `linear-gradient(135deg, ${t.accent}26, transparent)`,
                        borderColor: `${t.accent}55`,
                      }}
                    >
                      <TileIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="text-title text-white/95 truncate">{t.label}</div>
                      <div className="text-caption truncate">{t.hint}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* TON wallet */}
      <div className="card p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="section-title">TON-кошелёк</div>
            <div className="text-[11px] text-white/50 mt-0.5">Премиум-косметика и Battle Pass.</div>
          </div>
          <TonConnectButton />
        </div>
        {wallet && (
          <div className="mt-2 text-[11px] text-white/60 font-mono break-all">
            {wallet.account.address}
          </div>
        )}
      </div>
    </div>
  );
}

function Bar({
  icon, label, value, max, color,
}: { icon: IconName; label: string; value: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  const Icon = ICONS[icon];
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-white/70 mb-1">
        <span className="flex items-center gap-1.5">
          <Icon size={12} />
          {label}
        </span>
        <span className="font-mono tabular-nums">{value} / {max}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/[0.07] overflow-hidden relative border border-white/5">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 rarity-shimmer pointer-events-none opacity-50" />
      </div>
    </div>
  );
}

function ResourceChip({ icon, value, label, tint }: { icon: IconName; value: number; label: string; tint: string }) {
  const Icon = ICONS[icon];
  return (
    <div
      className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-gradient-to-b from-white/[0.04] to-transparent"
      style={{ borderColor: `${tint}33` }}
    >
      <div className="grid place-items-center w-8 h-8 rounded-lg" style={{ color: tint, background: `${tint}15` }}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-white/50 leading-none">{label}</div>
        <div className="font-mono font-bold text-sm text-white/95 tabular-nums leading-tight">
          {value.toLocaleString("ru-RU")}
        </div>
      </div>
    </div>
  );
}

function StatRow({ stat, value, canSpend }: { stat: StatId; value: number; canSpend: boolean }) {
  const allocate = useGame((s) => s.allocatePoint);
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5 border border-white/5">
      <span className="text-xs text-white/70">{STAT_LABEL[stat]}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold tabular-nums">{value}</span>
        {canSpend && (
          <button
            className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition"
            onClick={() => allocate(stat)}
          >
            +
          </button>
        )}
      </span>
    </div>
  );
}

function KV({ icon, k, v }: { icon: IconName; k: string; v: string | number }) {
  const Icon = ICONS[icon];
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-white/60">
        <Icon size={11} />
        {k}
      </span>
      <span className="font-mono font-bold text-white/90 tabular-nums">{v}</span>
    </div>
  );
}
