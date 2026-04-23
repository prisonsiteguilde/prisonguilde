import { useGame } from "../store.js";
import { CLASS_META } from "@ton-abyss/shared";
import { motion } from "framer-motion";
import { ICONS, type IconName } from "./Icon.js";

export function TopBar() {
  const char = useGame((s) => s.character);
  const screen = useGame((s) => s.screen);
  const setScreen = useGame((s) => s.setScreen);
  if (!char) return null;
  const meta = CLASS_META[char.classId];

  return (
    <div className="sticky top-0 z-30 backdrop-blur-md bg-abyss-950/80 border-b border-white/10">
      <div className="max-w-screen-md mx-auto flex items-center gap-3 px-3 py-2">
        <button
          className="group shrink-0 grid place-items-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition hover:scale-105"
          onClick={() => setScreen("home")}
          aria-label="Главная"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11l9-8 9 8v10H3z" />
            <path d="M9 21v-6h6v6" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-display text-lg tracking-wider truncate" style={{ color: meta.palette }}>{meta.name}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 shrink-0">ур. {char.level}</span>
          </div>
          <XpBar xp={char.xp} level={char.level} />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Pill icon="gold"  value={fmt(char.gold)}      tone="#f59e0b" />
          <Pill icon="shard" value={fmt(char.shards)}    tone="#14f1c1" />
          <Pill icon="dust"  value={fmt(char.abyssDust)} tone="#c084fc" />
        </div>
      </div>
      {screen !== "home" && (
        <motion.div className="h-[2px] bg-gradient-to-r from-transparent via-abyss-500 to-transparent" layoutId="barGlow" />
      )}
    </div>
  );
}

function Pill({ icon, value, tone }: { icon: IconName; value: string; tone: string }) {
  const Icon = ICONS[icon];
  return (
    <div
      className="flex items-center gap-1 rounded-lg border px-1.5 py-1"
      style={{ borderColor: `${tone}33`, background: `${tone}0f` }}
    >
      <span style={{ color: tone }}>
        <Icon size={14} />
      </span>
      <span className="font-mono text-[12px] font-bold tabular-nums" style={{ color: tone }}>{value}</span>
    </div>
  );
}

function XpBar({ xp, level }: { xp: number; level: number }) {
  const need = Math.round(60 * level * level + 3.6 * Math.pow(level, 2.6) + 40 * level);
  const pct = Math.min(100, (xp / need) * 100);
  return (
    <div className="mt-1 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-abyss-300 via-abyss-500 to-abyss-300 bg-[length:200%_100%] animate-gradient-x"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}
