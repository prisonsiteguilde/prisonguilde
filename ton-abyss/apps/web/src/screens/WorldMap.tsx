import { motion } from "framer-motion";
import { useState } from "react";
import { useGame } from "../store.js";
import { WORLD_MAP, ACT_META } from "@ton-abyss/content";
import { ICONS } from "../components/Icon.js";
import type { MapNode } from "@ton-abyss/shared";

const BIOME_COLOR: Record<string, string> = {
  haven: "#86efac",
  crypt: "#c084fc",
  holy: "#fde68a",
  water: "#67e8f9",
  ice: "#bae6fd",
  infernal: "#fca5a5",
  abyss: "#6ee7b7",
};

const KIND_LABEL: Record<string, string> = {
  town: "Убежище",
  dungeon: "Данж",
  boss: "Босс",
  portal: "Портал",
  event: "Событие",
};

export function WorldMap() {
  const setScreen = useGame((s) => s.setScreen);
  const mapProgress = useGame((s) => s.mapProgress);
  const enterMapNode = useGame((s) => s.enterMapNode);
  const [hovered, setHovered] = useState<MapNode | null>(null);
  const [selected, setSelected] = useState<MapNode | null>(null);
  const [activeAct, setActiveAct] = useState<1 | 2 | 3 | 4>(1);

  // Compute connections
  const connections: Array<{ from: MapNode; to: MapNode; unlocked: boolean }> = [];
  for (const node of WORLD_MAP) {
    for (const reqId of node.requires ?? []) {
      const from = WORLD_MAP.find((n) => n.id === reqId);
      if (from) {
        const unlocked = mapProgress.unlocked.includes(node.id) || mapProgress.cleared.includes(from.id);
        connections.push({ from, to: node, unlocked });
      }
    }
  }

  const acts: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];
  const visibleNodes = WORLD_MAP.filter((n) => n.act === activeAct);
  const visibleConnections = connections.filter((c) => c.from.act === activeAct || c.to.act === activeAct);
  const actMeta = ACT_META[activeAct];

  return (
    <div className="px-4 py-4 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <button className="btn-ghost btn-sm" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title text-gradient-abyss">Мировая карта</h2>
        <span className="w-12" />
      </div>

      {/* Act selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {acts.map((a) => {
          const m = ACT_META[a];
          const isActive = a === activeAct;
          return (
            <button
              key={a}
              onClick={() => setActiveAct(a)}
              className={`shrink-0 px-3 py-2 rounded-xl border transition text-left ${
                isActive ? "bg-white/10 border-white/20" : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
              }`}
              style={isActive ? { borderColor: m.color } : undefined}
            >
              <div className="font-display text-xs tracking-widest uppercase" style={{ color: m.color }}>
                Акт {a}
              </div>
              <div className="text-[10px] text-white/60 truncate max-w-[140px]">
                {m.name.replace(`Акт ${a} — `, "")}
              </div>
            </button>
          );
        })}
      </div>

      {/* Map canvas */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3]"
        style={{
          background: `
            radial-gradient(400px 200px at 50% 50%, ${actMeta.color}18, transparent 70%),
            linear-gradient(180deg, #0a1428 0%, #03060f 100%)
          `,
        }}
      >
        {/* Background grid */}
        <svg viewBox="0 0 100 75" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="mapgrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
            </pattern>
            <radialGradient id="act-haze" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={actMeta.color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={actMeta.color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100" height="75" fill="url(#mapgrid)" />
          <rect width="100" height="75" fill="url(#act-haze)" />

          {/* Connection lines with flow animation */}
          {visibleConnections.map((c, i) => {
            const fromVisible = c.from.act === activeAct;
            const toVisible = c.to.act === activeAct;
            if (!fromVisible || !toVisible) return null;
            const stroke = c.unlocked ? actMeta.color : "#ffffff20";
            return (
              <g key={i}>
                <line
                  x1={c.from.x}
                  y1={c.from.y * 0.75}
                  x2={c.to.x}
                  y2={c.to.y * 0.75}
                  stroke={stroke}
                  strokeWidth="0.4"
                  strokeDasharray={c.unlocked ? "0" : "1,1"}
                  opacity={c.unlocked ? 0.7 : 0.3}
                />
                {c.unlocked && (
                  <line
                    x1={c.from.x}
                    y1={c.from.y * 0.75}
                    x2={c.to.x}
                    y2={c.to.y * 0.75}
                    stroke={stroke}
                    strokeWidth="0.8"
                    strokeDasharray="2,3"
                    opacity="0.8"
                  >
                    <animate attributeName="stroke-dashoffset" from="0" to="-5" dur="1.5s" repeatCount="indefinite" />
                  </line>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {visibleNodes.map((n) => {
            const unlocked = mapProgress.unlocked.includes(n.id);
            const cleared = mapProgress.cleared.includes(n.id);
            const biomeColor = BIOME_COLOR[n.biome ?? "haven"] ?? "#888";
            const color = cleared ? "#4ade80" : unlocked ? biomeColor : "#444";
            return (
              <g key={n.id}>
                {/* Pulse ring on active */}
                {unlocked && !cleared && (
                  <circle cx={n.x} cy={n.y * 0.75} r="2.5" fill="none" stroke={color} strokeWidth="0.3" opacity="0.6">
                    <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={n.x} cy={n.y * 0.75} r="2" fill="#03060f" stroke={color} strokeWidth="0.5" />
                {n.kind === "boss" && (
                  <path
                    d={`M ${n.x - 1} ${n.y * 0.75 - 0.3} L ${n.x} ${n.y * 0.75 + 0.8} L ${n.x + 1} ${n.y * 0.75 - 0.3} Z`}
                    fill={color}
                    opacity="0.9"
                  />
                )}
                {n.kind === "town" && <circle cx={n.x} cy={n.y * 0.75} r="0.6" fill={color} />}
                {n.kind === "portal" && (
                  <circle cx={n.x} cy={n.y * 0.75} r="0.8" fill="none" stroke={color} strokeWidth="0.3">
                    <animate attributeName="r" values="0.4;1.2;0.4" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Click overlay for nodes */}
        <div className="absolute inset-0">
          {visibleNodes.map((n) => {
            const unlocked = mapProgress.unlocked.includes(n.id);
            return (
              <button
                key={n.id}
                className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full hover:bg-white/10 active:scale-90 transition disabled:opacity-40 ${selected?.id === n.id ? "ring-2 ring-white/70" : ""}`}
                style={{ left: `${n.x}%`, top: `${n.y * 0.75 + 1}%` }}
                disabled={!unlocked}
                onClick={() => setSelected(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n)}
                aria-label={n.name}
              />
            );
          })}
        </div>

        {/* Act title overlay */}
        <div className="absolute top-2 left-3 right-3 pointer-events-none">
          <div className="font-display text-lg tracking-widest" style={{ color: actMeta.color }}>
            {actMeta.name}
          </div>
          <div className="text-[10px] text-white/50 mt-0.5">{actMeta.description}</div>
        </div>

        {/* Hovered node info */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-2 right-2 bottom-2 card p-2.5 pointer-events-none"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="chip" style={{ color: BIOME_COLOR[hovered.biome ?? "haven"] }}>
                {KIND_LABEL[hovered.kind] ?? hovered.kind}
              </span>
              <div className="font-display text-sm tracking-wide">{hovered.name}</div>
              {hovered.levelReq > 0 && (
                <span className="text-[10px] text-white/50 ml-auto">ур. {hovered.levelReq}+</span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Selected node — inline confirm panel */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-4 space-y-3"
          style={{ borderColor: `${BIOME_COLOR[selected.biome ?? "haven"]}66` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-micro text-white/50 uppercase tracking-wider">
                {KIND_LABEL[selected.kind] ?? selected.kind} · {actMeta.name.replace(`Акт ${activeAct} — `, "")}
              </div>
              <div className="text-title" style={{ color: BIOME_COLOR[selected.biome ?? "haven"] }}>
                {selected.name}
              </div>
              {selected.levelReq > 0 && (
                <div className="text-caption text-white/60">Требуется ур. {selected.levelReq}</div>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white/70 text-xl leading-none px-2">×</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelected(null)}
              className="btn-secondary py-2.5 text-caption"
            >
              Отмена
            </button>
            <button
              onClick={() => { const id = selected.id; setSelected(null); enterMapNode(id); }}
              className="btn-primary py-2.5 text-caption font-bold"
            >
              {selected.kind === "town" ? "Войти" : selected.kind === "boss" ? "Бросить вызов" : "Начать поход"} →
            </button>
          </div>
        </motion.div>
      )}

      {/* Node list grid (accessible) */}
      <div className="space-y-2">
        <div className="section-title px-1">Локации акта</div>
        <div className="grid grid-cols-2 gap-2">
          {visibleNodes.map((n) => {
            const unlocked = mapProgress.unlocked.includes(n.id);
            const cleared = mapProgress.cleared.includes(n.id);
            const biomeColor = BIOME_COLOR[n.biome ?? "haven"] ?? "#888";
            const kindIcon =
              n.kind === "boss" ? ICONS.skull :
              n.kind === "dungeon" ? ICONS.dungeons :
              n.kind === "portal" ? ICONS.gem :
              n.kind === "town" ? ICONS.shop :
              ICONS.map;
            const IconComp = kindIcon;
            return (
              <motion.button
                key={n.id}
                whileTap={{ scale: unlocked ? 0.97 : 1 }}
                disabled={!unlocked}
                onClick={() => enterMapNode(n.id)}
                className={`card p-3 text-left relative overflow-hidden ${
                  !unlocked ? "opacity-50" : cleared ? "card-hover" : "card-hover"
                }`}
                style={unlocked && !cleared ? { borderColor: `${biomeColor}66` } : undefined}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-xl grid place-items-center border shrink-0"
                    style={{
                      color: unlocked ? biomeColor : "#666",
                      background: `${unlocked ? biomeColor : "#666"}1a`,
                      borderColor: `${unlocked ? biomeColor : "#666"}33`,
                    }}
                  >
                    <IconComp size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm tracking-wide truncate">{n.name}</div>
                    <div className="text-[10px] text-white/60">{KIND_LABEL[n.kind] ?? n.kind}</div>
                    {n.levelReq > 0 && <div className="text-[10px] text-white/50">ур. {n.levelReq}+</div>}
                  </div>
                  {cleared && <span className="chip-success text-[9px]">✓</span>}
                  {!unlocked && <span className="text-white/30">🔒</span>}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
