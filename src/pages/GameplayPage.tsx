import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { BackgroundImage, ScenarioDescription, ChoiceList } from '../components/game';
import { LoadingSpinner } from '../components/ui';

const GameplayPage: React.FC = () => {
  const { gameState, selectChoice, setCurrentPage } = useGameStore();
  const [showChoices, setShowChoices] = useState(false);

  const currentScenario = gameState?.scenarios[gameState.currentScenarioIndex || 0];
  const isLoading = gameState?.isLoading && gameState?.loadingType === 'scenario-loading';

  useEffect(() => {
    if (!gameState) {
      setCurrentPage('main');
      return;
    }
  }, [gameState, setCurrentPage]);

  useEffect(() => {
    if (currentScenario && !isLoading) {
      // Reset choices visibility when scenario changes
      setShowChoices(false);

      const timer = setTimeout(() => {
        setShowChoices(true);
      }, 8000); // 타이핑 애니메이션을 고려한 시간

      return () => {
        clearTimeout(timer);
      };
    }
    // When no scenario or loading, ensure choices are hidden
    if (!currentScenario || isLoading) {
      setShowChoices(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario?.id, isLoading]);

  const handleChoiceSelect = async (choiceId: string) => {
    setShowChoices(false);
    await selectChoice(choiceId);
  };

  const handleScreenClick = () => {
    if (!showChoices && currentScenario && !isLoading) {
      setShowChoices(true);
    }
  };

  if (!gameState || !currentScenario) {
    return (
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-black" />
        <div className="card p-8 text-center bg-white/10 backdrop-blur border border-white/30 relative z-10 text-white">
          <LoadingSpinner size="lg" message="게임을 불러오는 중..." />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden cursor-pointer flex justify-center items-center "
      onClick={handleScreenClick}
    >
      {/* 배경 이미지 */}
      <BackgroundImage
        imageUrl={currentScenario.backgroundImageUrl}
        altText={currentScenario.title}
        isLoading={isLoading}
      />

      {/* 게임 진행 상태 표시 */}
      <div className="absolute top-6 left-6 z-20">
        <div className="bg-white/10 border border-white/30 backdrop-blur rounded-lg px-4 py-2 text-white">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">
                {gameState.choices.length} / {gameState.scenarios.length} 진행
              </span>
            </div>
            <div className="w-24 bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(gameState.choices.length / gameState.scenarios.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 설정 정보 */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-white/10 border border-white/30 backdrop-blur rounded-lg px-4 py-2 text-white text-sm">
          {gameState.setup.participants === 'single' && '🧑‍🦲 혼자'}
          {gameState.setup.participants === 'double' && '👫 둘이서'}
          {gameState.setup.participants === 'group' && '👥 단체로'}
          <span className="mx-2">•</span>
          {gameState.setup.activity === 'swimming' && '🏊‍♂️ 해수욕'}
          {gameState.setup.activity === 'fishing' && '🎣 낚시'}
          {gameState.setup.activity === 'leisure' && '🏄‍♂️ 레저활동'}
        </div>
      </div>

      {/* 상황 정보 */}
      <div className="absolute bottom-6 left-6 z-20">
        <div className="bg-white/10 border border-white/30 backdrop-blur rounded-lg px-4 py-2 text-white text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {currentScenario.context}
          </div>
        </div>
      </div>

      {/* 시나리오 설명 */}
      {!showChoices && !isLoading && (
        <ScenarioDescription
          title={currentScenario.title}
          description={currentScenario.description}
          isVisible={!showChoices && !isLoading}
        />
      )}

      {/* 선택지 */}
      {showChoices && !isLoading && (
        <ChoiceList
          choices={currentScenario.choices}
          onChoiceSelect={handleChoiceSelect}
          disabled={isLoading}
        />
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-30">
          <div className="card p-8 text-center bg-white/10 border border-white/30 backdrop-blur text-white">
            <LoadingSpinner size="lg" message="다음 시나리오를 준비하고 있습니다..." />
          </div>
        </div>
      )}

      {/* 도움말 */}
      {!showChoices && !isLoading && (
        <div className="absolute bottom-6 right-6 z-20 animate-pulse">
          <div className="bg-white/10 border border-white/30 backdrop-blur rounded-lg px-3 py-2 text-white text-xs">
            💡 화면을 클릭하여 계속하기
          </div>
        </div>
      )}
    </div>
  );
};

export default GameplayPage;
