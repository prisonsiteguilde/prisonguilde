import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { damageTypeLabel, items, rarityLabel } from "@corsairs/shared";
import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "./store";
const tabs = [
    { id: "captain", label: "Капитан" },
    { id: "combat", label: "Бой" },
    { id: "craft", label: "Крафт" },
    { id: "loot", label: "Сундуки" },
    { id: "ship", label: "Корабль" },
    { id: "market", label: "Рынок" },
    { id: "ton", label: "TON" },
    { id: "security", label: "Античит" }
];
export function App() {
    const { init, loading, error, state } = useGameStore();
    const [tab, setTab] = useState("captain");
    useEffect(() => {
        void init();
    }, [init]);
    if (loading)
        return _jsx(Shell, { children: _jsx("div", { className: "loading", children: "\u041F\u043E\u0434\u043D\u0438\u043C\u0430\u0435\u043C \u043F\u0430\u0440\u0443\u0441\u0430..." }) });
    if (error)
        return _jsx(Shell, { children: _jsxs("div", { className: "error", children: ["\u041E\u0448\u0438\u0431\u043A\u0430: ", error] }) });
    if (!state)
        return _jsx(Shell, { children: _jsx("div", { className: "error", children: "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E" }) });
    return (_jsxs(Shell, { children: [_jsx(Header, { player: state.player }), _jsx("nav", { className: "tabs", children: tabs.map((entry) => (_jsx("button", { className: tab === entry.id ? "active" : "", onClick: () => setTab(entry.id), children: entry.label }, entry.id))) }), tab === "captain" && _jsx(CaptainView, { player: state.player }), tab === "combat" && _jsx(CombatView, { enemies: state.catalog.enemies }), tab === "craft" && _jsx(CraftView, { recipes: state.catalog.recipes, jobs: state.craftJobs, player: state.player }), tab === "loot" && _jsx(LootView, { chests: state.catalog.chests }), tab === "ship" && _jsx(ShipView, { player: state.player }), tab === "market" && _jsx(MarketView, {}), tab === "ton" && _jsx(TonView, { player: state.player }), tab === "security" && _jsx(SecurityView, {})] }));
}
function Shell({ children }) {
    return (_jsxs("main", { className: "app", children: [_jsx("div", { className: "sea" }), _jsx("section", { className: "panel", children: children })] }));
}
function Header({ player }) {
    const xpNext = Math.floor(120 * player.level ** 1.72 + 80 * player.level);
    return (_jsxs("header", { className: "hero", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Telegram Mini App \u00B7 TON Network" }), _jsx("h1", { children: "Corsairs: Return of the Legend" }), _jsxs("p", { children: ["\u041A\u0430\u043F\u0438\u0442\u0430\u043D ", player.displayName, " \u00B7 ", player.islandId, " \u00B7 \u041F\u0440\u0435\u0441\u0442\u0438\u0436 ", player.prestige] })] }), _jsx("div", { className: "wallet", children: _jsx(TonConnectButton, {}) }), _jsxs("div", { className: "resource-grid", children: [_jsx(Stat, { label: "LVL", value: player.level }), _jsx(Stat, { label: "XP", value: `${player.xp}/${xpNext}` }), _jsx(Stat, { label: "\u041F\u0438\u0430\u0441\u0442\u0440\u044B", value: player.currencies.piastres.toLocaleString("ru-RU") }), _jsx(Stat, { label: "\u0414\u0443\u0431\u043B\u043E\u043D\u044B", value: player.currencies.doubloons })] })] }));
}
function CaptainView({ player }) {
    const gear = player.inventory.filter((item) => item.rarity !== "common").slice(0, 8);
    return (_jsxs("section", { className: "grid two", children: [_jsx(Card, { title: "\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0438", children: _jsxs("div", { className: "stats-list", children: [_jsx(Stat, { label: "HP", value: `${player.stats.hp}/${player.stats.maxHp}` }), _jsx(Stat, { label: "\u0412\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C", value: player.stats.stamina }), _jsx(Stat, { label: "\u042D\u043D\u0435\u0440\u0433\u0438\u044F", value: player.stats.energy }), _jsx(Stat, { label: "\u0411\u0440\u043E\u043D\u044F", value: player.stats.armor }), _jsx(Stat, { label: "\u041C\u0435\u0442\u043A\u043E\u0441\u0442\u044C", value: `${Math.round(player.stats.accuracy)}%` }), _jsx(Stat, { label: "\u0423\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435", value: `${Math.round(player.stats.evasion)}%` }), _jsx(Stat, { label: "\u041A\u0440\u0438\u0442", value: `${Math.round(player.stats.critChance)}% ×${player.stats.critMultiplier.toFixed(1)}` }), _jsx(Stat, { label: "\u0423\u0434\u0430\u0447\u0430", value: `${Math.round(player.stats.luck)}%` })] }) }), _jsx(Card, { title: "\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u0438", children: _jsx("div", { className: "loot-list", children: gear.map((item) => _jsx(InventoryRow, { item: item }, item.uid)) }) }), _jsx(Card, { title: "\u041F\u0438\u0442\u043E\u043C\u0446\u044B \u0438 \u043B\u043E\u044F\u043B\u044C\u043D\u043E\u0441\u0442\u044C", children: player.pets.map((pet) => (_jsxs("div", { className: "pet", children: [_jsx("strong", { children: pet.name }), _jsxs("span", { children: [pet.evolution, " \u00B7 LVL ", pet.level] }), _jsx("meter", { value: pet.loyalty, min: 0, max: 100 })] }, pet.id))) }), _jsx(Card, { title: "\u041A\u0432\u0435\u0441\u0442\u044B", children: Object.entries(player.quests).map(([id, quest]) => (_jsxs("div", { className: "quest", children: [_jsx("span", { children: id.replaceAll("_", " ") }), _jsxs("b", { children: [quest.status, " \u00B7 ", quest.progress, "/", quest.goal] })] }, id))) })] }));
}
function CombatView({ enemies }) {
    const { activeBattle, startBattle, useMove } = useGameStore();
    return (_jsxs("section", { className: "grid two", children: [_jsx(Card, { title: "\u0412\u044B\u0431\u043E\u0440 \u043F\u0440\u043E\u0442\u0438\u0432\u043D\u0438\u043A\u0430", children: _jsx("div", { className: "enemy-list", children: enemies.map((enemy) => (_jsxs("button", { className: "enemy-card", onClick: () => void startBattle(enemy.id), children: [_jsx("strong", { children: enemy.name }), _jsxs("span", { children: ["LVL ", enemy.level, " \u00B7 ", enemy.archetype] }), _jsxs("small", { children: ["\u041D\u0430\u0433\u0440\u0430\u0434\u0430: ", enemy.rewards.xp, " XP, ", enemy.rewards.piastres[0], "\u2013", enemy.rewards.piastres[1], " \u043F\u0438\u0430\u0441\u0442\u0440\u043E\u0432"] })] }, enemy.id))) }) }), _jsx(BattlePanel, { battle: activeBattle, onMove: (moveId) => void useMove(moveId) })] }));
}
function BattlePanel({ battle, onMove }) {
    if (!battle)
        return _jsx(Card, { title: "\u0411\u043E\u0439", children: _jsx("p", { children: "\u0412\u044B\u0431\u0435\u0440\u0438 \u043F\u0440\u043E\u0442\u0438\u0432\u043D\u0438\u043A\u0430. \u0412\u0441\u0435 \u0440\u0430\u0441\u0447\u0451\u0442\u044B \u0431\u0443\u0434\u0443\u0442 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u044B \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C." }) });
    const moves = ["thrust", "slash", "riposte", "pistol", "bomb", "skullbreaker", "harvest"];
    return (_jsxs(Card, { title: `Бой: ${battle.enemy.name}`, children: [_jsxs("div", { className: "combat-bars", children: [_jsx(HealthBar, { label: battle.player.name, hp: battle.player.stats.hp, max: battle.player.stats.maxHp }), _jsx(HealthBar, { label: battle.enemy.name, hp: battle.enemy.stats.hp, max: battle.enemy.stats.maxHp })] }), _jsx("div", { className: "move-grid", children: moves.map((move) => (_jsx("button", { disabled: battle.phase !== "player", onClick: () => onMove(move), children: move }, move))) }), _jsx("div", { className: "battle-log", children: battle.log.slice(-8).map((entry, index) => _jsx("p", { children: entry.message }, `${entry.turn}-${index}`)) })] }));
}
function CraftView({ recipes, jobs, player }) {
    const { startCraft, claimCraft } = useGameStore();
    return (_jsxs("section", { className: "grid two", children: [_jsx(Card, { title: "\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u0438", children: _jsx("div", { className: "stats-list", children: Object.entries(player.professions).map(([profession, state]) => (_jsx(Stat, { label: profession, value: `LVL ${state.level} · ${state.xp} XP` }, profession))) }) }), _jsxs(Card, { title: "\u041E\u0447\u0435\u0440\u0435\u0434\u044C", children: [jobs.length === 0 && _jsx("p", { children: "\u041E\u0447\u0435\u0440\u0435\u0434\u044C \u043F\u0443\u0441\u0442\u0430." }), jobs.map((job) => {
                        const done = Date.now() >= new Date(job.completesAt).getTime();
                        return (_jsxs("div", { className: "job", children: [_jsx("span", { children: job.recipeId }), _jsx("b", { children: job.claimed ? "получено" : done ? "готово" : new Date(job.completesAt).toLocaleTimeString("ru-RU") }), !job.claimed && done && _jsx("button", { onClick: () => void claimCraft(job.id), children: "\u0417\u0430\u0431\u0440\u0430\u0442\u044C" })] }, job.id));
                    })] }), _jsx(Card, { title: "\u0420\u0435\u0446\u0435\u043F\u0442\u044B", children: _jsx("div", { className: "recipe-list", children: recipes.map((recipe) => (_jsxs("button", { onClick: () => void startCraft(recipe.id), children: [_jsx("strong", { children: recipe.name }), _jsxs("span", { children: [recipe.profession, " LVL ", recipe.requiredLevel, " \u00B7 ", recipe.durationSeconds, "s"] })] }, recipe.id))) }) })] }));
}
function LootView({ chests: catalogChests }) {
    const { openChest, state } = useGameStore();
    return (_jsx("section", { className: "grid two", children: catalogChests.map((chest) => (_jsxs(Card, { title: chest.name, children: [_jsxs("p", { children: ["\u0426\u0435\u043D\u0430: ", chest.price.piastres ? `${chest.price.piastres} пиастров` : "", " ", chest.price.doubloons ? `${chest.price.doubloons} дублонов` : "бесплатно"] }), _jsxs("p", { children: ["Pity: Epic ", chest.pity.epic ?? "—", " \u00B7 Legendary ", chest.pity.legendary ?? "—", " \u00B7 Mythic ", chest.pity.mythic ?? "—"] }), _jsxs("p", { children: ["\u0422\u0435\u043A\u0443\u0449\u0438\u0439 pity: ", state?.player.pity[chest.id] ?? 0] }), _jsx("button", { onClick: () => void openChest(chest.id), children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0447\u0435\u0441\u0442\u043D\u043E" })] }, chest.id))) }));
}
function ShipView({ player }) {
    return (_jsxs("section", { className: "grid two", children: [_jsx(Card, { title: player.ship.name, children: _jsxs("div", { className: "stats-list", children: [_jsx(Stat, { label: "\u041A\u043B\u0430\u0441\u0441", value: player.ship.classId }), _jsx(Stat, { label: "HP", value: player.ship.hp }), _jsx(Stat, { label: "\u0422\u0440\u043E\u0444\u0435\u0438", value: player.ship.trophies }), _jsx(Stat, { label: "\u041E\u0444\u0438\u0446\u0435\u0440\u044B", value: player.ship.officers.length })] }) }), _jsx(Card, { title: "AI-\u043A\u0430\u043F\u0438\u0442\u0430\u043D PvP", children: player.ship.aiPreset.map((rule) => (_jsxs("div", { className: "quest", children: [_jsxs("span", { children: ["#", rule.priority, " ", rule.condition] }), _jsx("b", { children: rule.action })] }, rule.id))) })] }));
}
function MarketView() {
    const state = useGameStore((store) => store.state);
    return (_jsx("section", { className: "grid", children: _jsxs(Card, { title: "P2P \u0440\u044B\u043D\u043E\u043A \u0438 \u0430\u0443\u043A\u0446\u0438\u043E\u043D", children: [_jsx("p", { children: "\u0421\u0435\u0440\u0432\u0435\u0440 \u0443\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u043F\u0440\u0435\u0434\u043C\u0435\u0442 \u043D\u0430 escrow, \u0431\u0435\u0440\u0451\u0442 5%/10% sink \u0438 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0440\u0435\u0437\u0435\u0440\u0432\u0438\u0440\u0443\u0435\u0442 NFT \u0434\u043B\u044F Legendary/Mythic." }), _jsxs("div", { className: "market-list", children: [state?.market.length === 0 && _jsx("p", { children: "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u043B\u043E\u0442\u043E\u0432." }), state?.market.map((listing) => (_jsxs("div", { className: "listing", children: [_jsx(InventoryRow, { item: listing.item }), _jsxs("span", { children: [listing.kind, " \u00B7 \u0434\u043E ", new Date(listing.expiresAt).toLocaleString("ru-RU")] })] }, listing.id)))] })] }) }));
}
function TonView({ player }) {
    const address = useTonAddress();
    const nftItems = player.inventory.filter((item) => item.nft);
    return (_jsxs("section", { className: "grid two", children: [_jsxs(Card, { title: "TON Connect", children: [_jsx(TonConnectButton, {}), _jsx("p", { children: address ? `Кошелёк: ${address}` : "Подключи Tonkeeper или Telegram Wallet для mint/export NFT." })] }), _jsxs(Card, { title: "NFT-ready \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B", children: [nftItems.length === 0 && _jsx("p", { children: "Legendary/Mythic \u0435\u0449\u0451 \u043D\u0435 \u0434\u043E\u0431\u044B\u0442\u044B." }), nftItems.map((item) => _jsx(InventoryRow, { item: item }, item.uid))] })] }));
}
function SecurityView() {
    const state = useGameStore((store) => store.state);
    return (_jsxs("section", { className: "grid two", children: [_jsx(Card, { title: "Server-authoritative \u0437\u0430\u0449\u0438\u0442\u0430", children: _jsxs("ul", { children: [_jsx("li", { children: "Telegram initData \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u0442\u0441\u044F HMAC \u043D\u0430 backend." }), _jsx("li", { children: "Nonce \u0437\u0430\u0449\u0438\u0449\u0430\u0435\u0442 \u043E\u0442 replay-\u0437\u0430\u043F\u0440\u043E\u0441\u043E\u0432." }), _jsx("li", { children: "\u0411\u043E\u0439, \u0434\u0440\u043E\u043F, \u043A\u0440\u0430\u0444\u0442 \u0438 \u044D\u043A\u043E\u043D\u043E\u043C\u0438\u043A\u0430 \u0441\u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C." }), _jsx("li", { children: "Rate limit + behavioral timing \u0441\u0438\u0433\u043D\u0430\u043B\u044B \u043F\u0438\u0448\u0443\u0442\u0441\u044F \u0432 \u0430\u0443\u0434\u0438\u0442." })] }) }), _jsxs(Card, { title: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0441\u0438\u0433\u043D\u0430\u043B\u044B", children: [state?.anticheat.length === 0 && _jsx("p", { children: "\u041D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0439 \u043D\u0435\u0442." }), state?.anticheat.map((signal) => (_jsxs("div", { className: `signal ${signal.severity}`, children: [_jsx("b", { children: signal.category }), _jsx("span", { children: signal.message })] }, signal.id)))] })] }));
}
function Card({ title, children }) {
    return (_jsxs("article", { className: "card", children: [_jsx("h2", { children: title }), children] }));
}
function Stat({ label, value }) {
    return (_jsxs("div", { className: "stat", children: [_jsx("span", { children: label }), _jsx("strong", { children: value })] }));
}
function HealthBar({ label, hp, max }) {
    return (_jsxs("div", { className: "health", children: [_jsxs("div", { children: [_jsx("span", { children: label }), _jsxs("b", { children: [hp, "/", max] })] }), _jsx("meter", { min: 0, max: max, value: hp })] }));
}
function InventoryRow({ item }) {
    const definition = useMemo(() => items.find((entry) => entry.id === item.itemId), [item.itemId]);
    if (!definition)
        return null;
    return (_jsxs("div", { className: `inventory-row rarity-${item.rarity}`, children: [_jsx("strong", { children: definition.name }), _jsxs("span", { children: [rarityLabel[item.rarity], " \u00B7 \u00D7", item.quantity, item.superior ? " · Superior" : "", item.enhancement ? ` +${item.enhancement}` : ""] }), definition.damage && _jsxs("small", { children: [definition.damage.min, "\u2013", definition.damage.max, " ", damageTypeLabel[definition.damage.type]] }), item.nft && _jsxs("small", { children: ["NFT: ", item.nft.status] })] }));
}
