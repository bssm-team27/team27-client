import type {
  APIResponse,
  GameSetup,
  GameCreationResponse,
  ChoiceResponse,
  AnalysisData
} from '../types/game';

class GameAPI {
  private baseURL = 'http://localhost:8000/api';

  async createGame(setup: GameSetup): Promise<APIResponse<GameCreationResponse>> {
    try {
      const response = await fetch(`${this.baseURL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setup),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '게임 생성 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      };
    }
  }

  async selectChoice(gameId: string, choiceId: string): Promise<APIResponse<ChoiceResponse>> {
    try {
      const response = await fetch(`${this.baseURL}/games/${gameId}/choices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ choiceId }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '선택지 처리 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getAnalysis(gameId: string): Promise<APIResponse<AnalysisData>> {
    try {
      const response = await fetch(`${this.baseURL}/games/${gameId}/analysis`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '분석 데이터 생성 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const gameAPI = new GameAPI();