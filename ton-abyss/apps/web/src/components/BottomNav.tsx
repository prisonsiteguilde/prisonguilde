import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { ICONS, type IconName } from "./Icon.js";
import type { Screen } from "../store.js";

type NavItem = { id: Screen; label: string; icon: IconName; accent: string };

const NAV: NavItem[] = [
  { id: "home",         label: "Дом",      icon: "relic",       accent: "#a78bfa" },
  { id: "world_map",    label: "Карта",    icon: "map",         accent: "#60a5fa" },
  { id: "inventory",    label: "Сумка",    icon: "bag",         accent: "#a3e635" },
  { id: "market",       label: "Маркет",   icon: "shop",        accent: "#fbbf24" },
  { id: "battlepass",   label: "Пропуск",  icon: "achievement", accent: "#f472b6" },
];

const HIDDEN_ON: Screen[] = ["splash", "class_select", "active_combat", "dungeon_run"];

export function BottomNav() {
  const screen = useGame((s) => s.screen);
  const setScreen = useGame((s) => s.setScreen);
  const character = useGame((s) => s.character);
  const dailyRewards = useGame((s) => s.dailyRewards);
  const market = useGame((s) => s.market);
  const auction = useGame((s) => s.auction);
  const battlepass = useGame((s) => s.battlepass);

  if (!character) return null;
  if (HIDDEN_ON.includes(screen)) return null;

  // Compute claimable badges per nav item
  const recentSales = market.history.filter((h) => h.at > Date.now() - 5 * 60_000).length;
  const myAuctionsLeading = auction.lots.filter((l) => l.isMine && (l.bids?.length ?? 0) > 0).length;
  const badges: Partial<Record<Screen, number>> = {
    home: dailyRewards && !dailyRewards.claimedToday ? 1 : 0,
    market: recentSales,
    battlepass: battlepass && (battlepass.claimedFree?.length ?? 0) < battlepass.level ? 1 : 0,
    inventory: myAuctionsLeading,
  };

  return (
    <motion.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
    >
      <div className="mx-auto max-w-xl px-3 pb-2 pt-1 pointer-events-auto">
        <div className="bg-black/75 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl grid grid-cols-5 gap-0.5 p-1">
          {NAV.map((n) => {
            const active = screen === n.id;
            const Icon = ICONS[n.icon];
            return (
              <button
                key={n.id}
                onClick={() => setScreen(n.id)}
                className={`relative flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all ${
                  active ? "bg-white/10" : "hover:bg-white/5"
                }`}
                style={{ color: active ? n.accent : "rgba(255,255,255,0.55)" }}
                aria-label={n.label}
              >
                <div className="relative">
                  <Icon size={20} />
                  {(badges[n.id] ?? 0) > 0 && (
                    <span
                      className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold grid place-items-center shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    >
                      {(badges[n.id] ?? 0) > 9 ? "9+" : badges[n.id]}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-wide">{n.label}</span>
                {active && (
                  <motion.div
                    layoutId="navActive"
                    className="absolute -bottom-0 h-0.5 w-6 rounded-full"
                    style={{ background: n.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
