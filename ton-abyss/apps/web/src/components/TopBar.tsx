import { useGame } from "../store.js";
import { CLASS_META } from "@ton-abyss/shared";
import { motion } from "framer-motion";

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
          className="group shrink-0 grid place-items-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
          onClick={() => setScreen("home")}
          aria-label="Главная"
        >
          <span className="text-xl">🕳️</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg tracking-wider" style={{ color: meta.palette }}>{meta.name}</span>
            <span className="text-xs uppercase tracking-widest text-white/50">ур. {char.level}</span>
            {char.hardcoreMode && <span className="chip bg-red-500/20 text-red-300 border border-red-500/30">Хардкор</span>}
          </div>
          <XpBar xp={char.xp} level={char.level} />
        </div>
        <div className="flex items-center gap-2 shrink-0 text-sm">
          <Pill icon="💰" value={fmt(char.gold)} tone="#f59e0b" />
          <Pill icon="✨" value={fmt(char.shards)} tone="#60a5fa" />
          <Pill icon="🜚" value={fmt(char.abyssDust)} tone="#14f1c1" />
        </div>
      </div>
      {screen !== "home" && (
        <motion.div className="h-[2px] bg-gradient-to-r from-transparent via-abyss-500 to-transparent" layoutId="barGlow" />
      )}
    </div>
  );
}

function Pill({ icon, value, tone }: { icon: string; value: string; tone: string }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2 py-1">
      <span>{icon}</span>
      <span className="font-mono text-[13px]" style={{ color: tone }}>{value}</span>
    </div>
  );
}

function XpBar({ xp, level }: { xp: number; level: number }) {
  // local xp into current level / level cap
  const need = Math.round(60 * level * level + 3.6 * Math.pow(level, 2.6) + 40 * level);
  const pct = Math.min(100, (xp / need) * 100);
  return (
    <div className="mt-1 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-abyss-300 to-abyss-500"
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
