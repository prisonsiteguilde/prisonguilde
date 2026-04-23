import { motion } from "framer-motion";
import { useGame } from "../store.js";

export function Splash() {
  const setScreen = useGame((s) => s.setScreen);
  const character = useGame((s) => s.character);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
      {/* Massive abyss portal SVG */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full blur-3xl bg-abyss-500/30 animate-pulse-slow" />
        <AbyssPortal />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-8 font-display text-6xl tracking-[0.25em] text-gradient-abyss"
      >
        TON ABYSS
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mt-3 text-xs uppercase tracking-[0.45em] text-white/50"
      >
        Хардкорный roguelite-RPG
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-10 flex flex-col gap-3 w-full max-w-xs"
      >
        {character ? (
          <>
            <button className="btn-abyssal h-14 text-lg tracking-widest" onClick={() => setScreen("home")}>
              ПРОДОЛЖИТЬ
            </button>
            <button
              className="btn-ghost text-sm"
              onClick={() => {
                if (confirm("Начать заново? Все сохранения будут стёрты.")) {
                  useGame.getState().reset();
                }
              }}
            >
              Начать заново
            </button>
          </>
        ) : (
          <button className="btn-abyssal h-14 text-lg tracking-widest" onClick={() => setScreen("class_select")}>
            НАЧАТЬ СПУСК
          </button>
        )}
        <p className="text-xs text-white/40 mt-3 tracking-wide">
          Смерти считаются. Лут ценится. Бездна ждёт.
        </p>
      </motion.div>
    </div>
  );
}

function AbyssPortal() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="relative">
      <defs>
        <radialGradient id="portal-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" />
          <stop offset="40%" stopColor="#001f1a" />
          <stop offset="80%" stopColor="#0a5a4a" />
          <stop offset="100%" stopColor="#14f1c1" />
        </radialGradient>
        <radialGradient id="portal-ring" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#14f1c1" stopOpacity="0" />
          <stop offset="85%" stopColor="#14f1c1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#14f1c1" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer pulsing ring */}
      <circle cx="90" cy="90" r="85" fill="url(#portal-ring)">
        <animate attributeName="r" values="82;88;82" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Rotating rune ring */}
      <g transform-origin="90 90" style={{ animation: "rotate-slow 20s linear infinite" }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = 90 + Math.cos(angle) * 75;
          const y = 90 + Math.sin(angle) * 75;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="2" fill="#14f1c1" opacity={0.7 + Math.sin(i) * 0.3}>
                <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </g>

      {/* Core portal */}
      <circle cx="90" cy="90" r="55" fill="url(#portal-core)" />
      <circle cx="90" cy="90" r="30" fill="#000" />
      <circle cx="90" cy="90" r="12" fill="#14f1c1" opacity="0.8">
        <animate attributeName="r" values="10;16;10" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* Orbiting particles */}
      <g transform-origin="90 90" style={{ animation: "rotate-slow 8s linear infinite reverse" }}>
        <circle cx="90" cy="30" r="1.5" fill="#fff" opacity="0.8" />
        <circle cx="150" cy="90" r="1" fill="#c084fc" />
        <circle cx="90" cy="150" r="1.5" fill="#14f1c1" />
        <circle cx="30" cy="90" r="1" fill="#60a5fa" />
      </g>
    </svg>
  );
}
