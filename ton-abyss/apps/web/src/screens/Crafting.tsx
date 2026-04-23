import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { ITEMS, MATERIALS, RECIPES } from "@ton-abyss/content";
import { UPGRADE_TABLE, RARITY_COLOR, SALVAGE_YIELD } from "@ton-abyss/shared";
import { ScreenLayout } from "../components/ScreenLayout.js";

// Crafting level derived from accumulated crafting stats
function computeCraftingLevel(stats: { itemsCrafted: number; itemsSalvaged: number; itemsUpgraded: number }): { level: number; xp: number; xpNeed: number; totalXp: number } {
  const total = stats.itemsCrafted * 15 + stats.itemsSalvaged * 4 + stats.itemsUpgraded * 10;
  // XP per level: 120, 240, 380, 540, 720, 920, 1140, 1380, 1640, 1920… + N*40
  let remaining = total;
  let level = 1;
  let xpNeed = 120;
  while (remaining >= xpNeed && level < 50) {
    remaining -= xpNeed;
    level += 1;
    xpNeed = 120 + (level - 1) * 40 + (level - 1) * (level - 2) * 10;
  }
  return { level, xp: remaining, xpNeed, totalXp: total };
}

export function Crafting() {
  const craftingStats = useGame((s) => s.craftingStats);
  const [tab, setTab] = useState<"craft" | "upgrade" | "salvage" | "deep">("craft");
  const craftLvl = computeCraftingLevel(craftingStats);

  return (
    <ScreenLayout title="Кузня" subtitle={`Крафт, усиление, распыление, алхимия`} accent="#f59e0b">
      {/* Crafting level header */}
      <div className="card-elevated p-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl grid place-items-center border"
            style={{ color: "#f59e0b", background: "linear-gradient(135deg,#f59e0b26,transparent)", borderColor: "#f59e0b55" }}>
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 4h10l-1 8H8z" /><path d="M9 12v6M15 12v6M6 20h12" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <div className="text-title text-amber-200">Уровень кузнеца</div>
              <div className="text-display text-amber-300">{craftLvl.level}</div>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-white/5 overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: `${Math.min(100, (craftLvl.xp / Math.max(1, craftLvl.xpNeed)) * 100)}%` }} />
            </div>
            <div className="mt-1 text-caption flex items-center justify-between">
              <span>{craftLvl.xp} / {craftLvl.xpNeed} XP</span>
              <span className="text-white/45">Итого: {craftLvl.totalXp.toLocaleString("ru-RU")}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-micro">Скрафчено</div>
            <div className="text-title text-amber-200 tabular-nums">{craftingStats.itemsCrafted}</div>
          </div>
          <div className="text-center">
            <div className="text-micro">Распылено</div>
            <div className="text-title text-rose-200 tabular-nums">{craftingStats.itemsSalvaged}</div>
          </div>
          <div className="text-center">
            <div className="text-micro">Улучшено</div>
            <div className="text-title text-emerald-200 tabular-nums">{craftingStats.itemsUpgraded}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="seg">
        {(["craft", "upgrade", "salvage", "deep"] as const).map((t) => (
          <button key={t} className={`seg-item ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "craft" ? "Крафт" : t === "upgrade" ? "Усиление" : t === "salvage" ? "Распыл." : "Алхимия"}
          </button>
        ))}
      </div>

      {tab === "craft" && <CraftTab />}
      {tab === "upgrade" && <UpgradeTab />}
      {tab === "salvage" && <SalvageTab />}
      {tab === "deep" && <DeepCraftTab />}
    </ScreenLayout>
  );
}

function DeepCraftTab() {
  const inventory = useGame((s) => s.inventory);
  const transmute = useGame((s) => s.transmute);
  const reroll = useGame((s) => s.reroll);
  const tierUp = useGame((s) => s.tierUp);
  const pushToast = useGame((s) => s.pushToast);
  const [sel, setSel] = useState<string | null>(null);
  const items = inventory.filter((i) => {
    const slot = ITEMS[i.baseId]?.slot;
    return slot && !["consumable", "material", "rune", "key"].includes(slot);
  });
  const it = sel ? inventory.find((i) => i.uid === sel) : null;
  const base = it ? ITEMS[it.baseId] : null;

  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-300">Алхимия: трансмутация (+редкость), реролл аффиксов, повышение тира (+5 ур.).</div>
      <div className="grid grid-cols-4 gap-2 max-h-[40vh] overflow-y-auto">
        {items.map((i) => {
          const b = ITEMS[i.baseId];
          if (!b) return null;
          return (
            <button
              key={i.uid}
              onClick={() => setSel(i.uid)}
              className={`p-2 rounded text-[10px] border ${sel === i.uid ? "border-amber-400 bg-amber-900/30" : "border-slate-700 bg-slate-900/60"}`}
              style={{ color: RARITY_COLOR[i.rarity] }}
            >
              <div className="truncate">{b.name}</div>
              <div className="text-[9px] text-slate-500">ур.{i.level} · +{i.upgradeLevel}</div>
            </button>
          );
        })}
      </div>
      {it && base && (
        <div className="panel p-3 space-y-2">
          <div className="font-bold text-white" style={{ color: RARITY_COLOR[it.rarity] }}>{base.name}</div>
          <div className="text-[11px] text-slate-400">Редкость: {it.rarity} · ур.{it.level} · +{it.upgradeLevel}</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                const r = transmute(it.uid);
                if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
              }}
              className="btn-primary text-xs"
            >
              Трансмут.
            </button>
            <button
              onClick={() => {
                const r = reroll(it.uid);
                if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
              }}
              className="btn-primary text-xs"
            >
              Реролл аф.
            </button>
            <button
              onClick={() => {
                const r = tierUp(it.uid);
                if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
              }}
              className="btn-primary text-xs"
            >
              Тир +5
            </button>
          </div>
        </div>
      )}
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
