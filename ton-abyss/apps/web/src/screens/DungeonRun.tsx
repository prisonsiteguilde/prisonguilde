import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import type { CombatEvent } from "@ton-abyss/shared";

export function DungeonRun() {
  const log = useGame((s) => s.lastDungeonLog);
  const setScreen = useGame((s) => s.setScreen);
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!log.length) return;
    if (idx >= log.length) return;
    timer.current = window.setTimeout(() => setIdx((n) => n + 1), 180) as unknown as number;
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [idx, log]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [idx]);

  if (!log.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Лог боя пуст.</p>
          <button className="btn-primary mt-3" onClick={() => setScreen("home")}>На главную</button>
        </div>
      </div>
    );
  }

  const shown = log.slice(0, idx);
  const done = idx >= log.length;

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="panel-title">Бой</h2>
        <button className="btn-ghost" onClick={() => setScreen("home")}>Завершить</button>
      </div>

      <div className="card nebula p-4 h-[60vh] overflow-hidden relative">
        <div ref={scrollRef} className="h-full overflow-y-auto pr-2 space-y-1 font-mono text-[13px]">
          {shown.map((e, i) => (
            <LogLine key={i} e={e} latest={i === shown.length - 1} />
          ))}
        </div>
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-x-0 bottom-4 flex justify-center">
            <button className="btn-primary" onClick={() => setScreen("home")}>Забрать добычу</button>
          </motion.div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button className="btn-ghost text-sm" onClick={() => setIdx(log.length)}>Пропустить</button>
      </div>
    </div>
  );
}

function LogLine({ e, latest }: { e: CombatEvent; latest: boolean }) {
  if (e.flavor?.startsWith("Комната")) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="mt-2 font-display tracking-widest text-abyss-300 border-t border-white/10 pt-2"
      >
        ⟪ {e.flavor} ⟫
      </motion.div>
    );
  }
  if (e.killed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-red-400"
      >
        ☠ {e.flavor}
      </motion.div>
    );
  }
  const color = e.actor === "player"
    ? e.crit ? "text-amber-300" : "text-emerald-300"
    : e.dodged ? "text-sky-300" : "text-red-300";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${color} ${latest ? "font-semibold" : ""}`}
    >
      {e.flavor}
    </motion.div>
  );
}
