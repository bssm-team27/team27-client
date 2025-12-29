import { create } from 'zustand';
import type {GameStore, GameSetup, PageType, AnalysisData} from '../types/game';
import { gameAPI } from '../api/gameAPI';

export const useGameStore = create<GameStore>((set, get) => ({
  // State
  gameState: null,
  currentPage: 'main',
  error: null,

  // Actions
  setCurrentPage: (page: PageType) => {
    set({ currentPage: page, error: null });
  },

  setError: (error: string | null) => {
    set({ error });
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

        set(() => ({
          gameState: {
            gameId,
            setup,
            currentScenarioIndex: 0,
            scenarios: [initialScenario],
            choices: [],
            phase: 'playing',
            isLoading: false,
            loadingType: undefined
          },
          currentPage: 'game'
        }));
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

          if (isGameComplete) {
            return {
              ...state,
              gameState: {
                ...state.gameState,
                choices: updatedChoices,
                phase: 'analysis',
                isLoading: false,
                loadingType: undefined
              },
              currentPage: 'analysis'
            };
          } else if (nextScenario) {
            return {
              ...state,
              gameState: {
                ...state.gameState,
                currentScenarioIndex: state.gameState.currentScenarioIndex + 1,
                scenarios: [...state.gameState.scenarios, nextScenario],
                choices: updatedChoices,
                isLoading: false,
                loadingType: undefined
              }
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

      const response = await gameAPI.getAnalysis();

      if (response.success && response.data) {
        set((state) => ({
          gameState: state.gameState ? {
            ...state.gameState,
            isLoading: false,
            loadingType: undefined,
            phase: 'finished'
          } : null
        }));

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
      error: null
    });
  }
}));