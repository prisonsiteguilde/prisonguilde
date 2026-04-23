import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useGame } from "./store.js";
import { Splash } from "./screens/Splash.js";
import { ClassSelect } from "./screens/ClassSelect.js";
import { Home } from "./screens/Home.js";
import { Inventory } from "./screens/Inventory.js";
import { DungeonList } from "./screens/DungeonList.js";
import { DungeonRun } from "./screens/DungeonRun.js";
import { Crafting } from "./screens/Crafting.js";
import { Pets } from "./screens/Pets.js";
import { Shop } from "./screens/Shop.js";
import { Codex } from "./screens/Codex.js";
import { ActiveCombat } from "./screens/ActiveCombat.js";
import { WorldMap } from "./screens/WorldMap.js";
import { SkillTree } from "./screens/SkillTree.js";
import { Sockets } from "./screens/Sockets.js";
import { Quests } from "./screens/Quests.js";
import { Achievements } from "./screens/Achievements.js";
import { Leaderboard } from "./screens/Leaderboard.js";
import { Tower } from "./screens/Tower.js";
import { Arena } from "./screens/Arena.js";
import { Bounties } from "./screens/Bounties.js";
import { Hunts } from "./screens/Hunts.js";
import { Expeditions } from "./screens/Expeditions.js";
import { Factions } from "./screens/Factions.js";
import { Stash } from "./screens/Stash.js";
import { Mounts } from "./screens/Mounts.js";
import { Relics } from "./screens/Relics.js";
import { Enchanting } from "./screens/Enchanting.js";
import { Toasts } from "./components/Toasts.js";
import { TopBar } from "./components/TopBar.js";
import { LootReveal } from "./components/LootReveal.js";
import { BossCinematic } from "./components/BossCinematic.js";

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
          </motion.div>
        </AnimatePresence>
      </div>
      <Toasts />
      <LootReveal />
      <BossCinematic />
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
