import { create } from "zustand";
import * as api from "./api";
export const useGameStore = create((set, get) => ({
    loading: true,
    error: null,
    state: null,
    activeBattle: null,
    async init() {
        set({ loading: true, error: null });
        try {
            await api.createSession();
            const state = await api.loadState();
            set({ state, activeBattle: state.activeBattles[0] ?? null, loading: false });
        }
        catch (error) {
            set({ error: error instanceof Error ? error.message : String(error), loading: false });
        }
    },
    async refresh() {
        const state = await api.loadState();
        set({ state, activeBattle: state.activeBattles[0] ?? get().activeBattle });
    },
    async startBattle(enemyId) {
        const battle = await api.startBattle(enemyId);
        set({ activeBattle: battle });
        window.Telegram?.WebApp.hapticFeedback?.impactOccurred("medium");
    },
    async useMove(moveId) {
        const battle = get().activeBattle;
        if (!battle)
            return;
        const result = await api.battleAction(battle.id, moveId);
        const state = get().state;
        set({
            activeBattle: result.battle,
            state: result.player && state ? { ...state, player: result.player } : state
        });
        if (result.battle.phase === "finished") {
            window.Telegram?.WebApp.hapticFeedback?.notificationOccurred(result.battle.winner === "player" ? "success" : "error");
            await get().refresh();
        }
    },
    async openChest(chestId) {
        const result = await api.openChest(chestId);
        const state = get().state;
        if (state)
            set({ state: { ...state, player: result.player } });
        window.Telegram?.WebApp.hapticFeedback?.notificationOccurred("success");
    },
    async startCraft(recipeId) {
        const result = await api.startCraft(recipeId);
        const state = get().state;
        if (state)
            set({ state: { ...state, player: result.player, craftJobs: [...state.craftJobs, result.job] } });
    },
    async claimCraft(jobId) {
        const result = await api.claimCraft(jobId);
        const state = get().state;
        if (state) {
            set({
                state: {
                    ...state,
                    player: result.player,
                    craftJobs: state.craftJobs.map((job) => job.id === result.job.id ? result.job : job)
                }
            });
        }
    },
    updatePlayer(player) {
        const state = get().state;
        if (state)
            set({ state: { ...state, player } });
    }
}));
