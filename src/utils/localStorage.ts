import type { GameState } from '../types/game';

const STORAGE_KEYS = {
  GAME_STATES: 'marine-safety-sim-games',
  ACTIVE_GAME_ID: 'marine-safety-sim-active-game'
} as const;

export interface StoredGameState extends GameState {
  lastSaved: string;
}

export interface GameStorage {
  [gameId: string]: StoredGameState;
}

export const gameLocalStorage = {
  saveGame: (gameState: GameState): void => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.GAME_STATES);
      const games: GameStorage = storedData ? JSON.parse(storedData) : {};

      games[gameState.gameId] = {
        ...gameState,
        lastSaved: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEYS.GAME_STATES, JSON.stringify(games));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_GAME_ID, gameState.gameId);
    } catch (error) {
      console.error('게임 저장 중 오류:', error);
    }
  },

  loadGame: (gameId: string): StoredGameState | null => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.GAME_STATES);
      if (!storedData) return null;

      const games: GameStorage = JSON.parse(storedData);
      const gameState = games[gameId];

      if (gameState) {
        const restoredState = {
          ...gameState,
          choices: gameState.choices.map(choice => ({
            ...choice,
            timestamp: new Date(choice.timestamp)
          }))
        };

        localStorage.setItem(STORAGE_KEYS.ACTIVE_GAME_ID, gameId);
        return restoredState;
      }

      return null;
    } catch (error) {
      console.error('게임 로드 중 오류:', error);
      return null;
    }
  },

  deleteGame: (gameId: string): void => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.GAME_STATES);
      if (!storedData) return;

      const games: GameStorage = JSON.parse(storedData);
      delete games[gameId];

      localStorage.setItem(STORAGE_KEYS.GAME_STATES, JSON.stringify(games));

      const activeGameId = localStorage.getItem(STORAGE_KEYS.ACTIVE_GAME_ID);
      if (activeGameId === gameId) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_GAME_ID);
      }
    } catch (error) {
      console.error('게임 삭제 중 오류:', error);
    }
  },

  getAllGames: (): GameStorage => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.GAME_STATES);
      return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
      console.error('게임 목록 로드 중 오류:', error);
      return {};
    }
  },

  getActiveGameId: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_GAME_ID);
  },

  clearAllGames: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.GAME_STATES);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_GAME_ID);
    } catch (error) {
      console.error('게임 데이터 삭제 중 오류:', error);
    }
  },

  getGamesSummary: () => {
    const games = gameLocalStorage.getAllGames();
    return Object.entries(games).map(([gameId, gameState]) => ({
      gameId,
      setup: gameState.setup,
      phase: gameState.phase,
      lastSaved: gameState.lastSaved,
      scenarioCount: gameState.scenarios.length,
      choiceCount: gameState.choices.length
    }));
  }
};