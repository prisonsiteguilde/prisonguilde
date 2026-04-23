import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useGame } from "../store.js";

export function Toasts() {
  const toasts = useGame((s) => s.toasts);
  const dismiss = useGame((s) => s.dismissToast);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      setTimeout(() => dismiss(t.id), t.tone === "epic" ? 4500 : 2800),
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  return (
    <div className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={toneClass(t.tone)}
          >
            <span className="font-mono text-sm">{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function toneClass(tone: string | undefined): string {
  const base = "pointer-events-auto rounded-xl px-4 py-2 backdrop-blur-md shadow-xl border";
  switch (tone) {
    case "good":
      return base + " bg-emerald-500/20 border-emerald-400/40 text-emerald-100";
    case "bad":
      return base + " bg-red-500/20 border-red-400/40 text-red-100";
    case "epic":
      return base + " bg-amber-500/20 border-amber-400/50 text-amber-50 font-semibold";
    default:
      return base + " bg-white/10 border-white/20 text-white/90";
  }
}
