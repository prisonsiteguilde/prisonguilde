import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGame } from "../store.js";

const REWARDS = [
  { day: 1, label: "500g", desc: "Золото" },
  { day: 2, label: "1k g + 5🔹", desc: "+ шарды" },
  { day: 3, label: "1.5k + 10🔹", desc: "" },
  { day: 4, label: "2.5k + 5✨", desc: "+ пыль" },
  { day: 5, label: "3.5k + 25🔹", desc: "" },
  { day: 6, label: "5k + 40🔹 + 15✨", desc: "" },
  { day: 7, label: "10k + 100🔹 + 50✨", desc: "Джекпот", highlight: true },
];

export function DailyRewardsModal() {
  const character = useGame((s) => s.character);
  const dr = useGame((s) => s.dailyRewards);
  const checkReward = useGame((s) => s.checkDailyReward);
  const claim = useGame((s) => s.claimDailyReward);
  const screen = useGame((s) => s.screen);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!character) return;
    checkReward();
  }, [character, checkReward]);

  useEffect(() => {
    if (!character) return;
    if (dismissed) return;
    if (screen === "splash" || screen === "class_select") return;
    if (!dr.claimedToday && !open) {
      const t = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, [character, dr.claimedToday, screen, open, dismissed]);

  if (!character) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => { setOpen(false); setDismissed(true); }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="card p-5 w-full max-w-md border border-amber-400/40 bg-gradient-to-b from-amber-500/15 to-amber-900/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-3">
              <div className="font-display text-xl tracking-wider text-amber-200">Ежедневная награда</div>
              <div className="text-[11px] text-white/55">Приходите каждый день подряд — хардкор: пропуск &gt; 1 день сбросит цикл</div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {REWARDS.map((r, i) => {
                const isCurrent = i === dr.currentDay && !dr.claimedToday;
                const isClaimed = i < dr.currentDay || (i === dr.currentDay && dr.claimedToday);
                return (
                  <motion.div
                    key={r.day}
                    animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                    transition={isCurrent ? { repeat: Infinity, duration: 1.8 } : {}}
                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 text-center ${
                      isClaimed
                        ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
                        : isCurrent
                        ? "bg-amber-500/25 border-amber-400/60 text-amber-100 shadow-[0_0_16px_rgba(245,158,11,0.4)]"
                        : r.highlight
                        ? "bg-fuchsia-500/10 border-fuchsia-400/30 text-fuchsia-200"
                        : "bg-white/5 border-white/10 text-white/55"
                    }`}
                  >
                    <div className="text-[9px] uppercase opacity-70">День</div>
                    <div className="font-display text-lg leading-none">{r.day}</div>
                    {isClaimed && <div className="text-[9px]">✓</div>}
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mb-4">
              <div className="text-[10px] uppercase tracking-wider text-white/55 mb-0.5">Сегодня</div>
              <div className="font-display text-base text-amber-200">{REWARDS[dr.currentDay]?.label}</div>
              {REWARDS[dr.currentDay]?.desc && (
                <div className="text-[11px] text-white/60">{REWARDS[dr.currentDay]?.desc}</div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="btn-ghost flex-1" onClick={() => { setOpen(false); setDismissed(true); }}>Позже</button>
              <button
                className="flex-1 py-2 rounded-lg font-bold text-sm bg-amber-500/30 border border-amber-400/50 text-amber-100 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={dr.claimedToday}
                onClick={() => {
                  const r = claim();
                  if (r.ok) {
                    setTimeout(() => setOpen(false), 300);
                  }
                }}
              >
                {dr.claimedToday ? "Получено" : "Забрать"}
              </button>
            </div>

            {dr.totalClaims > 0 && (
              <div className="text-center text-[10px] text-white/45 mt-3">
                Всего получено: {dr.totalClaims} дней подряд
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
