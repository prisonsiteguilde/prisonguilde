import { motion } from "framer-motion";
import { useState } from "react";
import { CLASS_META } from "@ton-abyss/shared";
import type { ClassId } from "@ton-abyss/shared";
import { useGame } from "../store.js";

const CLASS_ICONS: Record<ClassId, string> = {
  warden: "🛡️",
  runesmith: "🔨",
  voidcaller: "🌀",
  beastbound: "🐺",
};

export function ClassSelect() {
  const [pick, setPick] = useState<ClassId | null>(null);
  const [hardcore, setHardcore] = useState(true);
  const createCharacter = useGame((s) => s.createCharacter);
  const setScreen = useGame((s) => s.setScreen);

  const classes: ClassId[] = ["warden", "runesmith", "voidcaller", "beastbound"];

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button className="btn-ghost" onClick={() => setScreen("splash")}>← Назад</button>
        <h2 className="panel-title">Выбор класса</h2>
        <span className="w-16" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {classes.map((id) => {
          const m = CLASS_META[id];
          const selected = pick === id;
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPick(id)}
              className={`card p-4 relative overflow-hidden text-left transition-all ${selected ? "ring-2 ring-abyss-500" : "hover:border-white/25"}`}
              style={{ ["--accent" as any]: m.palette }}
            >
              <div
                className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-40"
                style={{ background: m.palette }}
              />
              <div className="text-4xl" style={{ filter: `drop-shadow(0 0 10px ${m.palette})` }}>
                {CLASS_ICONS[id]}
              </div>
              <div className="mt-2 font-display text-2xl tracking-wider" style={{ color: m.palette }}>
                {m.name}
              </div>
              <div className="text-[11px] text-white/60 mt-1">{m.tagline}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="chip">{m.weapon}</span>
                <span className="chip">{m.armor}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <label className="card p-4 flex items-center justify-between mb-4 cursor-pointer">
        <div>
          <div className="font-semibold">Хардкорный режим</div>
          <div className="text-xs text-white/60">Смерть = потеря 25% золота и XP. Бездна не прощает.</div>
        </div>
        <input
          type="checkbox"
          checked={hardcore}
          onChange={(e) => setHardcore(e.target.checked)}
          className="w-5 h-5 accent-red-500"
        />
      </label>

      <button
        className="btn-primary h-14 text-lg"
        disabled={!pick}
        onClick={() => pick && createCharacter(pick, hardcore)}
      >
        Войти в Бездну
      </button>
    </div>
  );
}
