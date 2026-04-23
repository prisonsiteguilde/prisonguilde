import { motion } from "framer-motion";
import { useGame } from "../store.js";

export function Splash() {
  const setScreen = useGame((s) => s.setScreen);
  const character = useGame((s) => s.character);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full blur-3xl bg-abyss-500/30 animate-pulse-slow" />
        <div className="relative text-8xl animate-float">🕳️</div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 font-display text-6xl tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-b from-white via-abyss-100 to-abyss-500"
      >
        TON ABYSS
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-3 text-sm uppercase tracking-[0.4em] text-white/50"
      >
        Хардкорный roguelite-RPG
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="mt-10 flex flex-col gap-3 w-full max-w-xs"
      >
        {character ? (
          <>
            <button className="btn-primary text-lg" onClick={() => setScreen("home")}>
              Продолжить
            </button>
            <button className="btn-ghost text-sm" onClick={() => useGame.getState().reset()}>
              Начать заново
            </button>
          </>
        ) : (
          <button className="btn-primary text-lg" onClick={() => setScreen("class_select")}>
            Начать спуск
          </button>
        )}
        <p className="text-xs text-white/40 mt-2">
          Смерти считаются. Лут ценится. Бездна ждёт.
        </p>
      </motion.div>
    </div>
  );
}
