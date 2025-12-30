import { create } from 'zustand';
import type {GameStore, GameSetup, PageType, AnalysisData, APIAnalysisResponse} from '../types/game';
import { gameAPI } from '../api/gameAPI';
import { getRandomBackground } from '../utils/randomBackground';
import { gameLocalStorage } from '../utils/localStorage';

export const useGameStore = create<GameStore>((set, get) => ({
  // State
  gameState: null,
  currentPage: 'main',
  error: null,
  backgroundImage: getRandomBackground(),

  // Actions
  setCurrentPage: (page: PageType) => {
    set({ currentPage: page, error: null });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setBackgroundImage: (image: string) => {
    set({ backgroundImage: image });
  },

  createGame: async (setup: GameSetup) => {
    try {
      set({ error: null });

      // Update loading state
      set(() => ({
        gameState: {
          gameId: '',
          setup,
          currentScenarioIndex: 0,
          scenarios: [],
          choices: [],
          phase: 'setup',
          isLoading: true,
          loadingType: 'game-creating'
        }
      }));

      const response = await gameAPI.createGame(setup);

      if (response.success && response.data) {
        const { gameId, initialScenario } = response.data;

        const newGameState = {
          gameId,
          setup,
          currentScenarioIndex: 0,
          scenarios: [initialScenario],
          choices: [],
          phase: 'playing' as const,
          isLoading: false,
          loadingType: undefined
        };

        set(() => ({
          gameState: newGameState,
          currentPage: 'game'
        }));

        // Save to localStorage
        gameLocalStorage.saveGame(newGameState);
      } else {
        throw new Error(response.error || '게임 생성에 실패했습니다.');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '게임 생성 중 오류가 발생했습니다.',
        gameState: null
      });
    }
  },

  selectChoice: async (choiceId: string) => {
    const { gameState } = get();
    if (!gameState) return;

    try {
      set({ error: null });

      // Set loading state
      set((state) => ({
        gameState: state.gameState ? {
          ...state.gameState,
          isLoading: true,
          loadingType: 'scenario-loading'
        } : null
      }));

      const currentScenario = gameState.scenarios[gameState.currentScenarioIndex];
      const selectedChoice = currentScenario.choices.find(c => c.id === choiceId);

      if (!selectedChoice) {
        throw new Error('선택지를 찾을 수 없습니다.');
      }

      // Record the choice
      const newChoice = {
        scenarioId: currentScenario.id,
        choiceId,
        timestamp: new Date(),
        safetyRating: selectedChoice.safetyRating
      };

      const response = await gameAPI.selectChoice(gameState.gameId, choiceId);

      if (response.success && response.data) {
        const { nextScenario, isGameComplete } = response.data;

        set((state) => {
          if (!state.gameState) return state;

          const updatedChoices = [...state.gameState.choices, newChoice];
          let updatedGameState;

          if (isGameComplete) {
            updatedGameState = {
              ...state.gameState,
              choices: updatedChoices,
              phase: 'analysis' as const,
              isLoading: false,
              loadingType: undefined
            };

            // Save to localStorage
            gameLocalStorage.saveGame(updatedGameState);

            return {
              ...state,
              gameState: updatedGameState,
              currentPage: 'analysis'
            };
          } else if (nextScenario) {
            updatedGameState = {
              ...state.gameState,
              currentScenarioIndex: state.gameState.currentScenarioIndex + 1,
              scenarios: [...state.gameState.scenarios, nextScenario],
              choices: updatedChoices,
              isLoading: false,
              loadingType: undefined
            };

            // Save to localStorage
            gameLocalStorage.saveGame(updatedGameState);

            return {
              ...state,
              gameState: updatedGameState
            };
          }

          return state;
        });
      } else {
        throw new Error(response.error || '선택지 처리에 실패했습니다.');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '선택지 처리 중 오류가 발생했습니다.',
        gameState: gameState ? {
          ...gameState,
          isLoading: false,
          loadingType: undefined
        } : null
      });
    }
  },

  getAnalysis: async (): Promise<AnalysisData | null> => {
    const { gameState } = get();
    if (!gameState) return null;

    try {
      set({ error: null });

      set((state) => ({
        gameState: state.gameState ? {
          ...state.gameState,
          isLoading: true,
          loadingType: 'analysis-loading'
        } : null
      }));

      const response = await gameAPI.getAnalysis(gameState.gameId);

      if (response.success && response.data) {
        set((state) => {
          if (!state.gameState) return state;

          const updatedGameState = {
            ...state.gameState,
            isLoading: false,
            loadingType: undefined,
            phase: 'finished' as const
          };

          // Save to localStorage
          gameLocalStorage.saveGame(updatedGameState);

          return {
            ...state,
            gameState: updatedGameState
          };
        });

        return response.data;
      } else {
        throw new Error(response.error || '분석 데이터를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.',
        gameState: gameState ? {
          ...gameState,
          isLoading: false,
          loadingType: undefined
        } : null
      });
      return null;
    }
  },

  resetGame: () => {
    set({
      gameState: null,
      currentPage: 'main',
      error: null,
      backgroundImage: getRandomBackground()
    });
  },

  loadSavedGame: (gameId: string) => {
    try {
      set({ error: null });
      const savedGame = gameLocalStorage.loadGame(gameId);

      if (savedGame) {
        const pageMap: Record<string, PageType> = {
          'setup': 'setup',
          'playing': 'game',
          'analysis': 'analysis',
          'finished': 'analysis'
        };

        set({
          gameState: savedGame,
          currentPage: pageMap[savedGame.phase] || 'main'
        });
      } else {
        throw new Error('저장된 게임을 찾을 수 없습니다.');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '게임 로드 중 오류가 발생했습니다.'
      });
    }
  },

  deleteSavedGame: (gameId: string) => {
    try {
      gameLocalStorage.deleteGame(gameId);
      const currentGameState = get().gameState;

      if (currentGameState && currentGameState.gameId === gameId) {
        set({
          gameState: null,
          currentPage: 'main',
          error: null,
          backgroundImage: getRandomBackground()
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '게임 삭제 중 오류가 발생했습니다.'
      });
    }
  },

  getSavedGames: () => {
    return gameLocalStorage.getGamesSummary();
  },

  loadLastActiveGame: () => {
    try {
      const activeGameId = gameLocalStorage.getActiveGameId();
      if (activeGameId) {
        const savedGame = gameLocalStorage.loadGame(activeGameId);
        if (savedGame) {
          const pageMap: Record<string, PageType> = {
            'setup': 'setup',
            'playing': 'game',
            'analysis': 'analysis',
            'finished': 'analysis'
          };

          set({
            gameState: savedGame,
            currentPage: pageMap[savedGame.phase] || 'main',
            error: null
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('마지막 활성 게임 로드 실패:', error);
      return false;
    }
  },

  // 분석 결과 저장
  saveAnalysisResult: (gameId: string, analysisData: AnalysisData) => {
    try {
      gameLocalStorage.saveAnalysisResult(gameId, analysisData);
    } catch (error) {
      console.error('분석 결과 저장 실패:', error);
    }
  },

  // 저장된 분석 결과 불러오기
  getAnalysisResult: (gameId: string): AnalysisData | null => {
    try {
      return gameLocalStorage.getAnalysisResult(gameId);
    } catch (error) {
      console.error('분석 결과 불러오기 실패:', error);
      return null;
    }
  }
}));
