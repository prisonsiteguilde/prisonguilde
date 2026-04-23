import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  icon?: "chest" | "sword" | "pet" | "market" | "search" | "scroll";
  title: string;
  hint?: string;
  action?: ReactNode;
}

const ICONS: Record<string, JSX.Element> = {
  chest: (
    <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="18" width="32" height="22" rx="2" />
      <path d="M8 24h32" />
      <circle cx="24" cy="28" r="2" fill="currentColor" />
      <path d="M10 18c0-4 6-8 14-8s14 4 14 8" />
    </svg>
  ),
  sword: (
    <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 34l20-20M10 38l4-4M10 38l4 4M10 38l-2 2 2 2M34 14l8-8" />
    </svg>
  ),
  pet: (
    <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="28" r="10" />
      <circle cx="18" cy="14" r="3" /><circle cx="30" cy="14" r="3" />
      <circle cx="14" cy="20" r="2" /><circle cx="34" cy="20" r="2" />
      <circle cx="21" cy="26" r="1" fill="currentColor" /><circle cx="27" cy="26" r="1" fill="currentColor" />
    </svg>
  ),
  market: (
    <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 18h32l-2 22H10z" />
      <path d="M16 18V12a8 8 0 0116 0v6" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="20" cy="20" r="12" />
      <path d="M30 30l10 10" />
    </svg>
  ),
  scroll: (
    <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 8h22a4 4 0 014 4v28a4 4 0 01-4 4H10z" />
      <path d="M14 14h16M14 20h16M14 26h10" />
    </svg>
  ),
};

export function EmptyState({ icon = "scroll", title, hint, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-10 px-4 text-center"
    >
      <div className="mb-3 text-white/25">{ICONS[icon]}</div>
      <div className="text-title text-white/80 mb-1">{title}</div>
      {hint && <div className="text-caption max-w-xs">{hint}</div>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
