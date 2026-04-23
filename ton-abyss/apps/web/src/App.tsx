import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import { useGame } from "./store.js";
import { Splash } from "./screens/Splash.js";
import { ClassSelect } from "./screens/ClassSelect.js";
import { Home } from "./screens/Home.js";
import { Toasts } from "./components/Toasts.js";
import { TopBar } from "./components/TopBar.js";
import { LootReveal } from "./components/LootReveal.js";
import { BottomNav } from "./components/BottomNav.js";
import { BossCinematic } from "./components/BossCinematic.js";

const Inventory = lazy(() => import("./screens/Inventory.js").then((m) => ({ default: m.Inventory })));
const DungeonList = lazy(() => import("./screens/DungeonList.js").then((m) => ({ default: m.DungeonList })));
const DungeonRun = lazy(() => import("./screens/DungeonRun.js").then((m) => ({ default: m.DungeonRun })));
const Crafting = lazy(() => import("./screens/Crafting.js").then((m) => ({ default: m.Crafting })));
const Pets = lazy(() => import("./screens/Pets.js").then((m) => ({ default: m.Pets })));
const Shop = lazy(() => import("./screens/Shop.js").then((m) => ({ default: m.Shop })));
const Codex = lazy(() => import("./screens/Codex.js").then((m) => ({ default: m.Codex })));
const ActiveCombat = lazy(() => import("./screens/ActiveCombat.js").then((m) => ({ default: m.ActiveCombat })));
const WorldMap = lazy(() => import("./screens/WorldMap.js").then((m) => ({ default: m.WorldMap })));
const SkillTree = lazy(() => import("./screens/SkillTree.js").then((m) => ({ default: m.SkillTree })));
const Sockets = lazy(() => import("./screens/Sockets.js").then((m) => ({ default: m.Sockets })));
const Quests = lazy(() => import("./screens/Quests.js").then((m) => ({ default: m.Quests })));
const Achievements = lazy(() => import("./screens/Achievements.js").then((m) => ({ default: m.Achievements })));
const Leaderboard = lazy(() => import("./screens/Leaderboard.js").then((m) => ({ default: m.Leaderboard })));
const Tower = lazy(() => import("./screens/Tower.js").then((m) => ({ default: m.Tower })));
const Arena = lazy(() => import("./screens/Arena.js").then((m) => ({ default: m.Arena })));
const Bounties = lazy(() => import("./screens/Bounties.js").then((m) => ({ default: m.Bounties })));
const Hunts = lazy(() => import("./screens/Hunts.js").then((m) => ({ default: m.Hunts })));
const Expeditions = lazy(() => import("./screens/Expeditions.js").then((m) => ({ default: m.Expeditions })));
const Factions = lazy(() => import("./screens/Factions.js").then((m) => ({ default: m.Factions })));
const Stash = lazy(() => import("./screens/Stash.js").then((m) => ({ default: m.Stash })));
const Mounts = lazy(() => import("./screens/Mounts.js").then((m) => ({ default: m.Mounts })));
const Relics = lazy(() => import("./screens/Relics.js").then((m) => ({ default: m.Relics })));
const Enchanting = lazy(() => import("./screens/Enchanting.js").then((m) => ({ default: m.Enchanting })));
const Clan = lazy(() => import("./screens/Clan.js").then((m) => ({ default: m.Clan })));
const BattlePass = lazy(() => import("./screens/BattlePass.js").then((m) => ({ default: m.BattlePass })));
const Lootboxes = lazy(() => import("./screens/Lootboxes.js").then((m) => ({ default: m.Lootboxes })));
const ClanBosses = lazy(() => import("./screens/ClanBosses.js").then((m) => ({ default: m.ClanBosses })));
const EchoRifts = lazy(() => import("./screens/EchoRifts.js").then((m) => ({ default: m.EchoRifts })));
const Market = lazy(() => import("./screens/Market.js").then((m) => ({ default: m.Market })));
const Auction = lazy(() => import("./screens/Auction.js").then((m) => ({ default: m.Auction })));
const TradePost = lazy(() => import("./screens/TradePost.js").then((m) => ({ default: m.TradePost })));

export function App() {
  const screen = useGame((s) => s.screen);
  const character = useGame((s) => s.character);

  useEffect(() => {
    if (!character && screen !== "splash" && screen !== "class_select") {
      useGame.getState().setScreen("splash");
    }
  }, [character, screen]);

  return (
    <div className="relative min-h-screen safe-pad">
      <StarfieldBackground />
      {character && screen !== "splash" && screen !== "class_select" && <TopBar />}
      <div className="relative z-10 min-h-screen max-w-screen-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="min-h-screen"
          >
            <Suspense fallback={<ScreenLoader />}>
            {screen === "splash" && <Splash />}
            {screen === "class_select" && <ClassSelect />}
            {screen === "home" && <Home />}
            {screen === "inventory" && <Inventory />}
            {screen === "dungeon_list" && <DungeonList />}
            {screen === "dungeon_run" && <DungeonRun />}
            {screen === "crafting" && <Crafting />}
            {screen === "pets" && <Pets />}
            {screen === "shop" && <Shop />}
            {screen === "codex" && <Codex />}
            {screen === "active_combat" && <ActiveCombat />}
            {screen === "world_map" && <WorldMap />}
            {screen === "skill_tree" && <SkillTree />}
            {screen === "sockets" && <Sockets />}
            {screen === "quests" && <Quests />}
            {screen === "achievements" && <Achievements />}
            {screen === "leaderboard" && <Leaderboard />}
            {screen === "tower" && <Tower />}
            {screen === "arena" && <Arena />}
            {screen === "bounties" && <Bounties />}
            {screen === "hunts" && <Hunts />}
            {screen === "expeditions" && <Expeditions />}
            {screen === "factions" && <Factions />}
            {screen === "stash" && <Stash />}
            {screen === "mounts" && <Mounts />}
            {screen === "relics" && <Relics />}
            {screen === "enchanting" && <Enchanting />}
            {screen === "clan" && <Clan />}
            {screen === "battlepass" && <BattlePass />}
            {screen === "lootboxes" && <Lootboxes />}
            {screen === "clan_bosses" && <ClanBosses />}
            {screen === "echo_rifts" && <EchoRifts />}
            {screen === "market" && <Market />}
            {screen === "auction" && <Auction />}
            {screen === "trade_post" && <TradePost />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
      <Toasts />
      <LootReveal />
      <BossCinematic />
      <BottomNav />
    </div>
  );
}

function ScreenLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
    </div>
  );
}

function StarfieldBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 nebula" />
      <div className="absolute inset-0 opacity-40" aria-hidden>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="star" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {Array.from({ length: 70 }).map((_, i) => {
            const x = (i * 61) % 100;
            const y = (i * 37) % 100;
            const r = (i % 3) + 0.5;
            return (
              <circle key={i} cx={`${x}%`} cy={`${y}%`} r={r} fill="url(#star)">
                <animate attributeName="opacity" values="0.2;1;0.2" dur={`${3 + (i % 5)}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
