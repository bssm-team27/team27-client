import React, {useEffect, useState, useRef, useMemo} from 'react';
import { useGameStore } from '../stores/gameStore';
import { Button, LoadingSpinner } from '../components/ui';
import type { AnalysisData, APIAnalysisResponse } from '../types/game';
import { getRandomBackground } from '../utils/randomBackground';
import { gameAPI } from '../api/gameAPI';

const AnalysisPage: React.FC = () => {
  const { gameState, getAnalysis, resetGame, setCurrentPage, backgroundImage, saveAnalysisResult } = useGameStore();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [apiAnalysis, setApiAnalysis] = useState<APIAnalysisResponse | null>(null);
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

    if (isLoadingRef.current) {
      return;
    }

    const loadAnalysis = async () => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        // API 분석 호출
        if (gameState?.phase === 'analysis') {
          console.log('Calling API analysis for game:', gameState.gameId);
          const apiResponse = await gameAPI.submitGameData(gameState);
          console.log('API Response:', apiResponse);

          // API 응답이 성공적이고 데이터가 있는지 확인
          if (apiResponse.success && apiResponse.data) {
            console.log('Setting API analysis data from .data:', apiResponse.data);
            setApiAnalysis(apiResponse.data);
          }
          // API 응답이 직접 분석 데이터인 경우 (success/data 래퍼가 없는 경우)
          else if (apiResponse.overall_evaluation || apiResponse.good_points || apiResponse.improvements) {
            console.log('Setting API analysis data directly:', apiResponse);
            setApiAnalysis(apiResponse);
          }
          else {
            console.log('API call failed or no data:', apiResponse);
          }
        }

        // Mock 분석 데이터를 기본값으로 생성 (UI 표시용)
        const mockAnalysisData = {
          totalScore: gameState?.choices?.reduce((sum, choice) => sum + choice.safetyRating, 0) || 0,
          maxScore: (gameState?.choices?.length || 1) * 5,
          safetyGrade: 'B' as const,
          strengths: ['적절한 안전 판단을 보였습니다.'],
          improvements: ['더 신중한 판단이 필요합니다.'],
          detailedFeedback: [],
          summary: '게임 결과를 분석 중입니다...',
          apiAnalysis: apiAnalysis || undefined
        };
        setAnalysisData(mockAnalysisData);
      } catch (error) {
        console.error('분석 로드 실패:', error);
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    };

    loadAnalysis();
  }, [gameState]);

  // API 분석 상태 추적용 useEffect
  useEffect(() => {
    console.log('API Analysis state updated:', apiAnalysis);

    // API 분석 결과가 있고 게임 상태가 있으면 로컬스토리지에 저장
    if (apiAnalysis && gameState?.gameId && analysisData) {
      const finalAnalysisData = {
        ...analysisData,
        apiAnalysis: apiAnalysis
      };

      saveAnalysisResult(gameState.gameId, finalAnalysisData);
      console.log('분석 결과를 로컬스토리지에 저장했습니다:', gameState.gameId);
    }
  }, [apiAnalysis, gameState, analysisData, saveAnalysisResult]);

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

  // 실제 선택 데이터를 기반으로 점수 추이 계산 (누적 평균 백분율)
  const choiceScoreSeries = gameState?.choices?.map((choice, index) => {
    // 현재 선택까지의 누적 평균 계산
    const cumulativeChoices = gameState.choices.slice(0, index + 1);
    const cumulativeSum = cumulativeChoices.reduce((sum, c) => sum + c.safetyRating, 0);
    const cumulativeAverage = cumulativeSum / cumulativeChoices.length;
    const cumulativePercentage = Math.round((cumulativeAverage / 5) * 100);

    return {
      label: `선택 ${index + 1}`,
      score: cumulativePercentage, // 누적 평균을 백분율로 변환
      choiceText: choice.text && choice.text.length > 20 ? choice.text.substring(0, 20) + '...' : choice.text || `선택 ${index + 1}`
    };
  }) || [];
  const chartWidth = 600;
  const chartHeight = 208;
  const chartPadding = { top: 24, right: 20, bottom: 40, left: 50 };

  // 백분율 기준으로 차트 범위 설정 (0-100%)
  const scoreMax = 100;
  const scoreMin = 0;
  const scoreRange = 100;
  const yTickCount = 6; // 0%, 20%, 40%, 60%, 80%, 100%
  const yTicks = Array.from({ length: yTickCount }, (_, index) => {
    const value = index * 20; // 0, 20, 40, 60, 80, 100
    const ratio = (scoreMax - value) / scoreRange;
    return { value, ratio };
  });
  const linePoints = choiceScoreSeries
    .map((item, index) => {
      const x =
        chartPadding.left +
        ((chartWidth - chartPadding.left - chartPadding.right) *
          (choiceScoreSeries.length === 1 ? 0 : index)) /
          Math.max(choiceScoreSeries.length - 1, 1);
      const y =
        chartPadding.top +
        (chartHeight - chartPadding.top - chartPadding.bottom) *
          (1 - (item.score - scoreMin) / scoreRange);
      return `${x},${y}`;
    })
    .join(' ');
  const areaPath = `M ${chartPadding.left},${chartHeight - chartPadding.bottom} L ${linePoints.replace(
    /,/g,
    ' '
  )} L ${chartWidth - chartPadding.right},${chartHeight - chartPadding.bottom} Z`;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${selectedBackground})` }}
    >
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-6xl mx-auto relative z-10">
          {/* 헤더 */}
          <div className="text-center mb-12 mt-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">게임 결과 분석</h1>
            <p className="text-white/70">당신의 해양 안전 의식 수준을 분석했습니다</p>
          </div>

          {/* 세로 플렉스 컨테이너 */}
          <div className="space-y-8">
            {/* 가로 플렉스 영역: 종합 점수 + 점수 추이 차트 */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 종합 점수 */}
              <div className="w-full lg:w-96 lg:max-w-sm min-h-full">
                <div className="p-8 text-center animate-slide-up bg-white/10 border border-white/20 backdrop-blur rounded-xl shadow-2xl h-full flex flex-col justify-center">
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

              {/* 선택지별 점수 그래프 */}
              <div className="flex-1 min-h-full">
                <div className="p-8 animate-slide-up bg-white/10 border border-white/20 backdrop-blur rounded-xl shadow-2xl h-full flex flex-col" style={{ animationDelay: '200ms' }}>
                  <h2 className="text-xl font-semibold text-white mb-6">선택지별 점수 추이</h2>
                  <div className="flex-1 flex items-center">
                    <svg
                      className="w-full"
                      style={{ aspectRatio: `${chartWidth} / ${chartHeight}` }}
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    >
                    {yTicks.map((tick) => {
                      const y =
                        chartPadding.top +
                        (chartHeight - chartPadding.top - chartPadding.bottom) * tick.ratio;
                      return (
                        <g key={`y-${tick.value}`}>
                          <line
                            x1={chartPadding.left}
                            y1={y}
                            x2={chartWidth - chartPadding.right}
                            y2={y}
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="1"
                          />
                          <text
                            x={chartPadding.left - 8}
                            y={y + 4}
                            textAnchor="end"
                            fontSize="11"
                            fill="rgba(255,255,255,0.6)"
                          >
                            {tick.value}%
                          </text>
                        </g>
                      );
                    })}
                    {choiceScoreSeries.map((item, index) => {
                      const x =
                        chartPadding.left +
                        ((chartWidth - chartPadding.left - chartPadding.right) *
                          (choiceScoreSeries.length === 1 ? 0 : index)) /
                          Math.max(choiceScoreSeries.length - 1, 1);
                      return (
                        <g key={`x-${item.label}`}>
                          <line
                            x1={x}
                            y1={chartPadding.top}
                            x2={x}
                            y2={chartHeight - chartPadding.bottom}
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="1"
                          />
                          <text
                            x={x}
                            y={chartHeight - chartPadding.bottom + 16}
                            textAnchor="middle"
                            fontSize="11"
                            fill="rgba(255,255,255,0.6)"
                          >
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                    <line
                      x1={chartPadding.left}
                      y1={chartHeight - chartPadding.bottom}
                      x2={chartWidth - chartPadding.right}
                      y2={chartHeight - chartPadding.bottom}
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="1"
                    />
                    <line
                      x1={chartPadding.left}
                      y1={chartPadding.top}
                      x2={chartPadding.left}
                      y2={chartHeight - chartPadding.bottom}
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="1"
                    />
                    <path
                      d={areaPath}
                      fill="rgba(255,255,255,0.08)"
                      stroke="none"
                    />
                    <polyline
                      points={linePoints}
                      fill="none"
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {choiceScoreSeries.map((item, index) => {
                      const x =
                        chartPadding.left +
                        ((chartWidth - chartPadding.left - chartPadding.right) *
                          (choiceScoreSeries.length === 1 ? 0 : index)) /
                          Math.max(choiceScoreSeries.length - 1, 1);
                      const y =
                        chartPadding.top +
                        (chartHeight - chartPadding.top - chartPadding.bottom) *
                          (1 - (item.score - scoreMin) / scoreRange);
                      return (
                        <g key={item.label}>
                          <circle cx={x} cy={y} r="3.5" fill="rgba(255,255,255,0.85)" />
                          <text
                            x={x}
                            y={y - 12}
                            textAnchor="middle"
                            fontSize="12"
                            fill="rgba(255,255,255,0.65)"
                          >
                            {item.score}%
                          </text>
                        </g>
                      );
                    })}
                    <text
                      x={chartWidth / 2}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fontSize="12"
                      fill="rgba(255,255,255,0.65)"
                    >
                      선택지
                    </text>
                    <text
                      x={12}
                      y={chartHeight / 2}
                      textAnchor="middle"
                      fontSize="12"
                      fill="rgba(255,255,255,0.65)"
                      transform={`rotate(-90 12 ${chartHeight / 2})`}
                    >
                      점수
                    </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 분석 */}
            <div className="animate-slide-up bg-white/10 border border-white/20 backdrop-blur rounded-xl shadow-2xl p-8" style={{ animationDelay: '300ms' }}>
              <h2 className="text-xl font-semibold text-white mb-6">상세 분석</h2>

              {/* 요약 */}
              <div className="bg-white/10 border border-white/15 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-white mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  분석 요약
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {apiAnalysis?.overall_evaluation || analysisData.summary}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 강점 */}
                {(apiAnalysis?.good_points || analysisData.strengths.length > 0) && (
                    <div className="bg-white/10 border border-white/15 rounded-lg p-6">
                      <h3 className="font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        강점
                      </h3>
                      {apiAnalysis?.good_points ? (
                        <p className="text-white/85 leading-relaxed">{apiAnalysis.good_points}</p>
                      ) : (
                        <ul className="space-y-2">
                          {analysisData.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-white mr-2 mt-1">✓</span>
                                <span className="text-white/85">{strength}</span>
                              </li>
                          ))}
                        </ul>
                      )}
                    </div>
                )}

                {/* 개선점 */}
                {(apiAnalysis?.improvements || analysisData.improvements.length > 0) && (
                    <div className="bg-white/10 border border-white/15 rounded-lg p-6">
                      <h3 className="font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        개선점
                      </h3>
                      {apiAnalysis?.improvements ? (
                        <p className="text-white/85 leading-relaxed">{apiAnalysis.improvements}</p>
                      ) : (
                        <ul className="space-y-2">
                          {analysisData.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-white mr-2 mt-1">💡</span>
                                <span className="text-white/85">{improvement}</span>
                              </li>
                          ))}
                        </ul>
                      )}
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* 게임 통계 */}
          {gameState?.choices?.length > 0 && (
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
