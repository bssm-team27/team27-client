import type {
  APIResponse,
  GameSetup,
  GameCreationResponse,
  ChoiceResponse,
  AnalysisData
} from '../types/game';
import { createMockGame, getMockChoiceResponse, getMockAnalysis } from './mockData';

class GameAPI {
  private baseURL = 'http://localhost:3000/api'; // 실제 API URL (현재는 미사용)
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async createGame(setup: GameSetup): Promise<APIResponse<GameCreationResponse>> {
    try {
      // 실제 서버 요청을 시뮬레이션하기 위한 지연
      await this.delay(1000 + Math.random() * 1000);

      // 목 데이터 생성
      const gameData = createMockGame(setup);

      return {
        success: true,
        data: gameData,
        timestamp: new Date().toISOString()
      };
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
      // 실제 서버 요청을 시뮬레이션하기 위한 지연
      await this.delay(800 + Math.random() * 500);

      // 목 데이터 생성
      const choiceData = getMockChoiceResponse(gameId, choiceId);

      return {
        success: true,
        data: choiceData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '선택지 처리 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getAnalysis(): Promise<APIResponse<AnalysisData>> {
    try {
      // 실제 서버 요청을 시뮬레이션하기 위한 지연
      await this.delay(1500 + Math.random() * 1000);

      // 목 데이터 생성
      const analysisData = getMockAnalysis();

      return {
        success: true,
        data: analysisData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '분석 데이터 생성 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      };
    }
  }

  // 실제 API 호출 메서드들 (나중에 백엔드 연동 시 사용)
  private async post<T>(endpoint: string, data: unknown): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      };
    }
  }

  private async get<T>(endpoint: string): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const gameAPI = new GameAPI();