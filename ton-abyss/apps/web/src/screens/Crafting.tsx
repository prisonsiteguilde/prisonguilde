import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { ITEMS, MATERIALS, RECIPES } from "@ton-abyss/content";
import { UPGRADE_TABLE, RARITY_COLOR, SALVAGE_YIELD } from "@ton-abyss/shared";

export function Crafting() {
  const setScreen = useGame((s) => s.setScreen);
  const [tab, setTab] = useState<"craft" | "upgrade" | "salvage">("craft");

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Кузня</h2>
        <span className="w-16" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(["craft", "upgrade", "salvage"] as const).map((t) => (
          <button
            key={t}
            className={`btn ${tab === t ? "bg-gradient-to-b from-amber-500 to-amber-700 text-white" : "btn-ghost"}`}
            onClick={() => setTab(t)}
          >
            {t === "craft" ? "Крафт" : t === "upgrade" ? "Усиление" : "Распыление"}
          </button>
        ))}
      </div>

      {tab === "craft" && <CraftTab />}
      {tab === "upgrade" && <UpgradeTab />}
      {tab === "salvage" && <SalvageTab />}
    </div>
  );
}

function CraftTab() {
  const materials = useGame((s) => s.materials);
  const gold = useGame((s) => s.character?.gold ?? 0);
  const doCraft = useGame((s) => s.craftRecipe);
  const recipes = Object.values(RECIPES);

  return (
    <div className="space-y-3">
      {recipes.map((r) => {
        const base = ITEMS[r.outputBaseId];
        const needGold = r.goldCost;
        const hasGold = gold >= needGold;
        const inputsOk = r.inputs.every((i) => (materials[i.baseId] ?? 0) >= i.qty);
        return (
          <motion.div key={r.id} whileHover={{ y: -2 }} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-xl tracking-wider">{r.name}</div>
                <div className="text-[11px] text-white/60">Выход: {base?.name} (ур. {r.outputLevel}, станок T{r.stationTier})</div>
              </div>
              <button
                className="btn-primary"
                disabled={!hasGold || !inputsOk}
                onClick={() => doCraft(r.id)}
              >
                Создать
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className={`chip ${hasGold ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"}`}>{needGold} 💰</span>
              {r.inputs.map((i) => {
                const have = materials[i.baseId] ?? 0;
                const mat = MATERIALS[i.baseId] ?? ITEMS[i.baseId];
                return (
                  <span key={i.baseId} className={`chip ${have >= i.qty ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"} normal-case tracking-normal`}>
                    {mat?.name ?? i.baseId}: {have}/{i.qty}
                  </span>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function UpgradeTab() {
  const inv = useGame((s) => s.inventory);
  const equipped = useGame((s) => s.equipped);
  const upgrade = useGame((s) => s.upgrade);
  const char = useGame((s) => s.character)!;

  const items = useMemo(() => {
    return inv.filter((i) => ITEMS[i.baseId]?.slot && !["consumable", "material", "rune", "pet_egg", "key"].includes(ITEMS[i.baseId]!.slot));
  }, [inv]);
  const [uid, setUid] = useState<string | null>(null);
  const item = uid ? items.find((i) => i.uid === uid) : undefined;
  const nextRow = item && item.upgradeLevel < 15 ? UPGRADE_TABLE[item.upgradeLevel] : null;
  void equipped;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {items.map((i) => {
          const b = ITEMS[i.baseId]!;
          return (
            <button
              key={i.uid}
              onClick={() => setUid(i.uid)}
              data-rarity={i.rarity}
              className={`rarity-border rarity-glow rounded-lg border bg-white/5 p-2 aspect-square ${uid === i.uid ? "ring-2 ring-white" : ""} text-left`}
            >
              <div className="text-xs font-mono text-amber-300">+{i.upgradeLevel}</div>
              <div className="text-[10px]" style={{ color: RARITY_COLOR[i.rarity] }}>{b.name}</div>
            </button>
          );
        })}
      </div>

      {item && nextRow && (
        <div className="card p-4">
          <div className="font-display text-xl tracking-wider">
            {ITEMS[item.baseId]?.name} <span className="text-amber-300">+{item.upgradeLevel} → +{nextRow.level}</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <Stat k="Шанс успеха" v={`${(nextRow.success * 100).toFixed(0)}%`} good />
            <Stat k="Шанс разрушения" v={`${(nextRow.destroy * 100).toFixed(0)}%`} bad />
            <Stat k="Стоимость" v={`${nextRow.goldCost} 💰 / ${nextRow.dustCost} 🜚`} />
          </div>
          <button
            className="btn-primary w-full mt-3"
            disabled={char.gold < nextRow.goldCost || char.abyssDust < nextRow.dustCost}
            onClick={() => {
              const r = upgrade(item.uid);
              if (r.result === "destroy") setUid(null);
            }}
          >
            Усилить
          </button>
          <p className="mt-2 text-[11px] text-white/50 italic">Бездна испытывает. Чем выше ранг, тем смертельнее риск.</p>
        </div>
      )}
    </div>
  );
}

function SalvageTab() {
  const inv = useGame((s) => s.inventory);
  const equipped = useGame((s) => s.equipped);
  const equippedSet = new Set(Object.values(equipped).filter(Boolean) as string[]);
  const salvage = useGame((s) => s.salvage);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const items = inv.filter((i) => !equippedSet.has(i.uid) && ["weapon", "offhand", "head", "chest", "legs", "hands", "feet", "ring", "amulet", "relic"].includes(ITEMS[i.baseId]?.slot ?? ""));

  const totals = useMemo(() => {
    let mats = 0, dust = 0, shards = 0;
    for (const uid of picked) {
      const it = items.find((i) => i.uid === uid);
      if (!it) continue;
      const y = SALVAGE_YIELD[it.rarity];
      mats += y.materials; dust += y.dust; shards += y.shards;
    }
    return { mats, dust, shards };
  }, [picked, items]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {items.map((i) => {
          const picked_ = picked.has(i.uid);
          const b = ITEMS[i.baseId]!;
          return (
            <button
              key={i.uid}
              onClick={() => {
                const n = new Set(picked);
                picked_ ? n.delete(i.uid) : n.add(i.uid);
                setPicked(n);
              }}
              data-rarity={i.rarity}
              className={`rarity-border rarity-glow rounded-lg border bg-white/5 p-2 aspect-square text-left ${picked_ ? "ring-2 ring-red-500" : ""}`}
            >
              <div className="text-[10px]" style={{ color: RARITY_COLOR[i.rarity] }}>{b.name}</div>
              {i.upgradeLevel > 0 && <div className="text-[10px] text-amber-300">+{i.upgradeLevel}</div>}
            </button>
          );
        })}
      </div>
      <div className="card p-4">
        <div className="text-sm">Выбрано: {picked.size} предметов</div>
        <div className="mt-1 text-[11px] text-white/70">Ожидаемый выход: {totals.mats} железа, {totals.dust} пыли Бездны, {totals.shards} шардов.</div>
        <button className="btn-danger w-full mt-3" disabled={picked.size === 0} onClick={() => { salvage([...picked]); setPicked(new Set()); }}>
          Распылить
        </button>
      </div>
    </div>
  );
}

function Stat({ k, v, good, bad }: { k: string; v: string; good?: boolean; bad?: boolean }) {
  return (
    <div className={`rounded bg-white/5 px-2 py-1 ${good ? "text-emerald-300" : bad ? "text-red-300" : "text-white/80"}`}>
      <div className="text-[10px] uppercase opacity-70">{k}</div>
      <div className="font-mono">{v}</div>
    </div>
  );
}
