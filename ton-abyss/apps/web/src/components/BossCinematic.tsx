import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useGame } from "../store.js";

export function BossCinematic() {
  const bossCinematic = useGame((s) => s.bossCinematic);
  const dismiss = useGame((s) => s.dismissBossCinematic);

  useEffect(() => {
    if (bossCinematic) {
      const t = setTimeout(() => dismiss(), 2500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [bossCinematic, dismiss]);

  return (
    <AnimatePresence>
      {bossCinematic && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-[96px] drop-shadow-[0_0_40px_rgba(239,68,68,0.9)]"
            >
              👹
            </motion.div>
            <motion.div
              initial={{ letterSpacing: "0em" }}
              animate={{ letterSpacing: "0.3em" }}
              transition={{ duration: 1 }}
              className="font-display text-4xl text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] uppercase"
            >
              {bossCinematic}
            </motion.div>
            <div className="text-sm text-white/60 mt-2 tracking-widest uppercase">БОСС ПРИБЛИЖАЕТСЯ</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
