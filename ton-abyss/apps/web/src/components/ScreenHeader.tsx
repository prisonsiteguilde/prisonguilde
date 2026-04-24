import { useGame } from "../store.js";
import type { Screen } from "../store.js";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  back?: Screen;
  action?: ReactNode;
  accent?: string;
}

export function ScreenHeader({ title, subtitle, back = "home", action, accent }: Props) {
  const setScreen = useGame((s) => s.setScreen);
  const tint = accent ?? "#60a5fa";
  return (
    <div className="relative">
      {/* accent glow */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-[60%] h-16 pointer-events-none blur-3xl opacity-25 rounded-full"
        style={{ background: tint }}
      />
      <div className="relative flex items-center justify-between gap-2">
        <button
          className="shrink-0 w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 grid place-items-center text-white/75 press transition-colors"
          onClick={() => setScreen(back)}
          aria-label="Назад"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 text-center min-w-0">
          <div
            className="font-display text-base tracking-wider truncate"
            style={{ color: tint, textShadow: `0 0 18px ${tint}44` }}
          >
            {title}
          </div>
          {subtitle && <div className="text-[10px] text-white/55 truncate">{subtitle}</div>}
        </div>
        <div className="shrink-0 min-w-[40px] flex items-center justify-end">{action ?? null}</div>
      </div>
      {/* accent underline */}
      <div
        className="mt-2 h-px opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${tint}88, transparent)`,
        }}
      />
    </div>
  );
}
