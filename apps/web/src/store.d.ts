import type { BattleState, Player } from "@corsairs/shared";
import type { GameState } from "./api";
interface GameStore {
    loading: boolean;
    error: string | null;
    state: GameState | null;
    activeBattle: BattleState | null;
    init(): Promise<void>;
    refresh(): Promise<void>;
    startBattle(enemyId: string): Promise<void>;
    useMove(moveId: string): Promise<void>;
    openChest(chestId: string): Promise<void>;
    startCraft(recipeId: string): Promise<void>;
    claimCraft(jobId: string): Promise<void>;
    updatePlayer(player: Player): void;
}
export declare const useGameStore: import("zustand").UseBoundStore<import("zustand").StoreApi<GameStore>>;
export {};
