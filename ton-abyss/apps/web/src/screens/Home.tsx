import { motion } from "framer-motion";
import { useGame, useDerivedStats } from "../store.js";
import { CLASS_META, STAT_LABEL } from "@ton-abyss/shared";
import type { StatId } from "@ton-abyss/shared";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";

import type { Screen } from "../store.js";

type Tile = { id: Screen; label: string; icon: string; hint: string; accent: string };
type MenuGroup = { key: string; title: string; icon: string; tiles: Tile[] };

const MENU: MenuGroup[] = [
  {
    key: "combat",
    title: "Бой",
    icon: "⚔️",
    tiles: [
      { id: "world_map", label: "Карта", icon: "🗺️", hint: "3 акта", accent: "#60a5fa" },
      { id: "dungeon_list", label: "Данжи", icon: "🗝️", hint: "Боссы и лут", accent: "#f43f5e" },
      { id: "tower", label: "Башня", icon: "🗼", hint: "∞ этажей", accent: "#e879f9" },
      { id: "arena", label: "Арена", icon: "🏟️", hint: "PvP ELO", accent: "#fb7185" },
      { id: "hunts", label: "Охота", icon: "🏹", hint: "Редкие цели", accent: "#22d3ee" },
    ],
  },
  {
    key: "gear",
    title: "Снаряжение",
    icon: "🎒",
    tiles: [
      { id: "inventory", label: "Инвентарь", icon: "🎒", hint: "Экипировка", accent: "#a3e635" },
      { id: "stash", label: "Стэш", icon: "🗃️", hint: "6 вкладок", accent: "#94a3b8" },
      { id: "crafting", label: "Кузня", icon: "⚒️", hint: "Крафт, +15", accent: "#f59e0b" },
      { id: "enchanting", label: "Чарование", icon: "✨", hint: "Эссенции, рунворды", accent: "#f472b6" },
      { id: "sockets", label: "Гнёзда", icon: "💎", hint: "Гемы, перековка", accent: "#c084fc" },
      { id: "skill_tree", label: "Навыки", icon: "🌳", hint: "Дерево умений", accent: "#14f1c1" },
    ],
  },
  {
    key: "companions",
    title: "Соратники",
    icon: "🐉",
    tiles: [
      { id: "pets", label: "Питомцы", icon: "🐉", hint: "Эволюция, слияние", accent: "#fb7185" },
      { id: "expeditions", label: "Экспедиции", icon: "🐾", hint: "Авто-квесты", accent: "#fbbf24" },
      { id: "mounts", label: "Скакуны", icon: "🐎", hint: "Транспорт", accent: "#fde047" },
    ],
  },
  {
    key: "quests",
    title: "Задания",
    icon: "📜",
    tiles: [
      { id: "quests", label: "Квесты", icon: "📜", hint: "Кампания", accent: "#84cc16" },
      { id: "bounties", label: "Баунти", icon: "📋", hint: "Дневные цели", accent: "#a3e635" },
      { id: "achievements", label: "Ачивки", icon: "🏆", hint: "Титулы, AP", accent: "#fcd34d" },
    ],
  },
  {
    key: "social",
    title: "Социальное",
    icon: "👥",
    tiles: [
      { id: "clan", label: "Клан", icon: "🏰", hint: "Союз, войны, банк", accent: "#f0abfc" },
      { id: "factions", label: "Фракции", icon: "⚜️", hint: "Репутация", accent: "#c084fc" },
      { id: "leaderboard", label: "Топ", icon: "👑", hint: "Мировой рейтинг", accent: "#fde047" },
    ],
  },
  {
    key: "world",
    title: "Мир и услуги",
    icon: "🌍",
    tiles: [
      { id: "relics", label: "Реликвии", icon: "🏺", hint: "Перман. бонусы", accent: "#d6bcfa" },
      { id: "shop", label: "Лавка", icon: "💼", hint: "Продать/купить", accent: "#94a3b8" },
      { id: "codex", label: "Кодекс", icon: "📖", hint: "Гид по миру", accent: "#a78bfa" },
    ],
  },
];

export function Home() {
  const char = useGame((s) => s.character)!;
  const setScreen = useGame((s) => s.setScreen);
  const derived = useDerivedStats()!;
  const wallet = useTonWallet();
  const meta = CLASS_META[char.classId];

  const primary: StatId[] = ["strength", "agility", "intellect", "vitality", "spirit", "luck"];

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Hero header */}
      <div className="card p-4 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-40" style={{ background: meta.palette }} />
        <div className="flex items-center gap-4">
          <div className="text-5xl">{char.classId === "warden" ? "🛡️" : char.classId === "runesmith" ? "🔨" : char.classId === "voidcaller" ? "🌀" : "🐺"}</div>
          <div className="flex-1">
            <div className="font-display text-3xl tracking-wider" style={{ color: meta.palette }}>{meta.name}</div>
            <div className="text-xs text-white/60">{meta.tagline}</div>
            <div className="mt-2 flex gap-2">
              <span className="chip">Уровень {char.level}</span>
              {char.hardcoreMode && <span className="chip bg-red-500/20 text-red-300 border border-red-500/30">Хардкор</span>}
              {char.deepestFloor > 0 && <span className="chip">Глубина: T{char.deepestFloor}</span>}
              {char.deaths > 0 && <span className="chip bg-red-500/10 text-red-300">☠ {char.deaths}</span>}
            </div>
          </div>
        </div>

        {/* HP/Mana */}
        <div className="mt-4 space-y-2">
          <Bar label="HP" value={char.hpCurrent} max={derived.maxHp} color="from-red-500 to-red-700" />
          <Bar label="MP" value={char.manaCurrent} max={derived.maxMana} color="from-abyss-300 to-abyss-500" />
        </div>

        {char.unspentPoints > 0 && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="mt-3 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-200"
          >
            Нераспределённые очки: <b>{char.unspentPoints}</b> — откройте инвентарь для распределения.
          </motion.div>
        )}
      </div>

      {/* Primary stats */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-display text-xl tracking-wider">Характеристики</div>
          {char.unspentPoints > 0 && (
            <div className="text-xs text-amber-300">+{char.unspentPoints} оч.</div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {primary.map((s) => (
            <StatRow key={s} stat={s} value={char.stats[s]} canSpend={char.unspentPoints > 0} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-white/70">
          <KV k="Атака" v={derived.attack} />
          <KV k="Магия" v={derived.spellPower} />
          <KV k="Защита" v={derived.defense} />
          <KV k="Скорость" v={derived.speed.toFixed(0)} />
          <KV k="Крит. шанс" v={`${(derived.critChance * 100).toFixed(1)}%`} />
          <KV k="Крит. множ." v={`×${derived.critMultiplier.toFixed(2)}`} />
          <KV k="Уклонение" v={`${(derived.dodge * 100).toFixed(1)}%`} />
          <KV k="Блок" v={`${(derived.blockChance * 100).toFixed(1)}%`} />
        </div>
      </div>

      {/* Menu by category */}
      {MENU.map((group) => (
        <div key={group.key} className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <span className="text-lg">{group.icon}</span>
            <h3 className="font-display text-lg tracking-wider text-white/80">{group.title}</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">{group.tiles.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {group.tiles.map((t) => (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -2 }}
                onClick={() => setScreen(t.id)}
                className="card p-3 relative overflow-hidden text-left"
              >
                <div
                  className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl opacity-40"
                  style={{ background: t.accent }}
                />
                <div className="text-2xl">{t.icon}</div>
                <div className="mt-1.5 font-display text-[15px] tracking-wide text-white/90 leading-tight">{t.label}</div>
                <div className="text-[10px] text-white/50 leading-tight">{t.hint}</div>
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      {/* TON wallet */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display tracking-wider">TON-кошелёк</div>
            <div className="text-[11px] text-white/50">Премиум-косметика, расширение хранилища и Battle Pass.</div>
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

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div>
      <div className="flex justify-between text-[11px] text-white/60 mb-1">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden relative">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

function StatRow({ stat, value, canSpend }: { stat: StatId; value: number; canSpend: boolean }) {
  const allocate = useGame((s) => s.allocatePoint);
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5">
      <span className="text-xs text-white/70">{STAT_LABEL[stat]}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-sm">{value}</span>
        <button
          disabled={!canSpend}
          onClick={() => allocate(stat)}
          className="w-5 h-5 rounded bg-abyss-700 text-white text-xs disabled:opacity-30"
        >
          +
        </button>
      </span>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex justify-between rounded bg-white/5 px-2 py-1">
      <span>{k}</span>
      <span className="font-mono text-white/90">{v}</span>
    </div>
  );
}
