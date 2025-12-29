import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { Button, LoadingSpinner } from '../components/ui';
import type { AnalysisData } from '../types/game';

const AnalysisPage: React.FC = () => {
  const { gameState, getAnalysis, resetGame, setCurrentPage } = useGameStore();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!gameState) {
      setCurrentPage('main');
      return;
    }

    const loadAnalysis = async () => {
      setIsLoading(true);
      const data = await getAnalysis();
      setAnalysisData(data);
      setIsLoading(false);
    };

    loadAnalysis();
  }, [gameState, getAnalysis, setCurrentPage]);

  const handleNewGame = () => {
    resetGame();
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreMessage = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return { text: '탁월한 안전 의식을 보여주셨습니다! 🏆', color: 'text-green-600' };
    if (percentage >= 80) return { text: '우수한 안전 판단력을 갖고 계십니다! 🎉', color: 'text-blue-600' };
    if (percentage >= 70) return { text: '양호한 안전 의식을 보여주셨습니다. 👍', color: 'text-yellow-600' };
    if (percentage >= 60) return { text: '기본적인 안전 의식이 있으시네요. 📚', color: 'text-orange-600' };
    return { text: '안전 의식을 더 기를 필요가 있어 보입니다. 💪', color: 'text-red-600' };
  };

  if (isLoading || !analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 flex items-center justify-center">
        <div className="card p-12 text-center max-w-md">
          <LoadingSpinner size="lg" message="게임 결과를 분석하고 있습니다..." />
        </div>
      </div>
    );
  }

  const scoreMessage = getScoreMessage(analysisData.totalScore, analysisData.maxScore);
  const percentage = Math.round((analysisData.totalScore / analysisData.maxScore) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-sky-800 mb-2">게임 결과 분석</h1>
          <p className="text-sky-700">당신의 해양 안전 의식 수준을 분석했습니다</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 종합 점수 */}
          <div className="lg:col-span-1">
            <div className="card p-8 text-center animate-slide-up">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">종합 점수</h2>

              {/* 점수 원형 차트 */}
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5f3ff"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="8"
                    strokeDasharray={`${percentage * 2.827} ${(100 - percentage) * 2.827}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-sky-600">{percentage}%</div>
                  <div className="text-sm text-gray-600">{analysisData.totalScore}/{analysisData.maxScore}</div>
                </div>
              </div>

              {/* 등급 */}
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${getGradeColor(analysisData.safetyGrade)} mb-4`}>
                안전 등급: {analysisData.safetyGrade}
              </div>

              <p className={`font-medium ${scoreMessage.color}`}>
                {scoreMessage.text}
              </p>
            </div>
          </div>

          {/* 상세 분석 */}
          <div className="lg:col-span-2">
            <div className="card p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">상세 분석</h2>

              {/* 요약 */}
              <div className="bg-sky-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-sky-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  분석 요약
                </h3>
                <p className="text-gray-700 leading-relaxed">{analysisData.summary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 강점 */}
                {analysisData.strengths.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      강점
                    </h3>
                    <ul className="space-y-2">
                      {analysisData.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          <span className="text-green-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 개선점 */}
                {analysisData.improvements.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      개선점
                    </h3>
                    <ul className="space-y-2">
                      {analysisData.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">💡</span>
                          <span className="text-blue-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 게임 통계 */}
        {gameState && (
          <div className="card p-8 mt-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">게임 통계</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-600">{gameState.choices.length}</div>
                <div className="text-sm text-gray-600">총 선택 횟수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {gameState.choices.filter(c => c.safetyRating >= 4).length}
                </div>
                <div className="text-sm text-gray-600">안전한 선택</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {gameState.choices.filter(c => c.safetyRating <= 2).length}
                </div>
                <div className="text-sm text-gray-600">위험한 선택</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(gameState.choices.reduce((sum, c) => sum + c.safetyRating, 0) / gameState.choices.length * 10) / 10}
                </div>
                <div className="text-sm text-gray-600">평균 안전도</div>
              </div>
            </div>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="space-x-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleNewGame}
              className="px-8 py-3"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              다시 체험하기
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setCurrentPage('main')}
              className="px-8 py-3"
            >
              메인으로 이동
            </Button>
          </div>
          <p className="mt-4 text-sm text-sky-600">
            🌊 더 많은 시나리오로 안전 의식을 키워보세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;