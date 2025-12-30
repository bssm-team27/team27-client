import React, {useEffect, useState, useRef, useMemo} from 'react';
import { useGameStore } from '../stores/gameStore';
import { Button, LoadingSpinner } from '../components/ui';
import type { AnalysisData } from '../types/game';
import { getRandomBackground } from '../utils/randomBackground';

const AnalysisPage: React.FC = () => {
  const { gameState, getAnalysis, resetGame, setCurrentPage, backgroundImage } = useGameStore();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isLoadingRef = useRef(false);

  const selectedBackground = useMemo(
    () => backgroundImage ?? getRandomBackground(),
    [backgroundImage]
  );

  useEffect(() => {
    if (!gameState) {
      setCurrentPage('main');
      return;
    }

    if (analysisData || isLoadingRef.current) {
      return;
    }

    const loadAnalysis = async () => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoading(true);
      const data = await getAnalysis();
      setAnalysisData(data);
      setIsLoading(false);
      isLoadingRef.current = false;
    };

    loadAnalysis();
  }, [gameState, analysisData]);

  const handleNewGame = () => {
    resetGame();
  };

  const getGradeColor = () => 'text-white bg-white/20 border border-white/30';

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
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-800 via-gray-900 to-black">
          <div className="absolute inset-0 bg-white/5" />
          <div className="relative z-10 max-w-md w-full bg-white/12 border border-white/25 backdrop-blur rounded-xl p-12 text-center text-white shadow-2xl">
            <LoadingSpinner size="lg" message="게임 결과를 분석하고 있습니다..." />
          </div>
        </div>
    );
  }

  const scoreMessage = getScoreMessage(analysisData.totalScore, analysisData.maxScore);
  const percentage = Math.round((analysisData.totalScore / analysisData.maxScore) * 100);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${selectedBackground})` }}
    >
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-6xl mx-auto relative z-10">
          {/* 헤더 */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">게임 결과 분석</h1>
            <p className="text-white/70">당신의 해양 안전 의식 수준을 분석했습니다</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 종합 점수 */}
            <div className="lg:col-span-1">
              <div className="p-8 text-center animate-slide-up bg-white/10 border border-white/20 backdrop-blur rounded-xl shadow-2xl">
                <h2 className="text-xl font-semibold text-white mb-6">종합 점수</h2>

                {/* 점수 원형 차트 */}
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="8"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="8"
                        strokeDasharray={`${percentage * 2.827} ${(100 - percentage) * 2.827}`}
                        className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-white">{percentage}%</div>
                    <div className="text-sm text-white/70">{analysisData.totalScore}/{analysisData.maxScore}</div>
                  </div>
                </div>

                {/* 등급 */}
                <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${getGradeColor()} mb-4`}>
                  안전 등급: {analysisData.safetyGrade}
                </div>

                <p className="font-medium text-white/80">
                  {scoreMessage.text}
                </p>
              </div>
            </div>

            {/* 상세 분석 */}
            <div className="lg:col-span-2">
              <div className="p-8 animate-slide-up bg-white/10 border border-white/20 backdrop-blur rounded-xl shadow-2xl" style={{ animationDelay: '200ms' }}>
                <h2 className="text-xl font-semibold text-white mb-6">상세 분석</h2>

                {/* 요약 */}
                <div className="bg-white/10 border border-white/15 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-white mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    분석 요약
                  </h3>
                  <p className="text-white/80 leading-relaxed">{analysisData.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* 강점 */}
                  {analysisData.strengths.length > 0 && (
                      <div className="bg-white/10 border border-white/15 rounded-lg p-6">
                        <h3 className="font-semibold text-white mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          강점
                        </h3>
                        <ul className="space-y-2">
                          {analysisData.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-white mr-2 mt-1">✓</span>
                                <span className="text-white/85">{strength}</span>
                              </li>
                          ))}
                        </ul>
                      </div>
                  )}

                  {/* 개선점 */}
                  {analysisData.improvements.length > 0 && (
                      <div className="bg-white/10 border border-white/15 rounded-lg p-6">
                        <h3 className="font-semibold text-white mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          개선점
                        </h3>
                        <ul className="space-y-2">
                          {analysisData.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-white mr-2 mt-1">💡</span>
                                <span className="text-white/85">{improvement}</span>
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
              <div className="p-8 mt-8 animate-slide-up bg-white/10 border border-white/20 backdrop-blur rounded-xl shadow-2xl" style={{ animationDelay: '400ms' }}>
                <h2 className="text-xl font-semibold text-white mb-6">게임 통계</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{gameState.choices.length}</div>
                    <div className="text-sm text-white/70">총 선택 횟수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {gameState.choices.filter(c => c.safetyRating >= 4).length}
                    </div>
                    <div className="text-sm text-white/70">안전한 선택</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {gameState.choices.filter(c => c.safetyRating <= 2).length}
                    </div>
                    <div className="text-sm text-white/70">위험한 선택</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {Math.round(gameState.choices.reduce((sum, c) => sum + c.safetyRating, 0) / gameState.choices.length * 10) / 10}
                    </div>
                    <div className="text-sm text-white/70">평균 안전도</div>
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
            <p className="mt-4 text-sm text-white/70">
              🌊 더 많은 시나리오로 안전 의식을 키워보세요!
            </p>
          </div>
        </div>
      </div>
  );
};

export default AnalysisPage;
