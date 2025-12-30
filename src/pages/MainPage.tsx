import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui';

const MainPage: React.FC = () => {
  const setCurrentPage = useGameStore(state => state.setCurrentPage);

  const handleStartGame = () => {
    setCurrentPage('setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 배경 파도 애니메이션 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-80 h-80 bg-sky-400/20 rounded-full animate-wave"></div>
          <div className="absolute top-20 -right-10 w-60 h-60 bg-sky-500/15 rounded-full animate-wave" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-sky-300/25 rounded-full animate-wave" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10">
          {/* 헤더 */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-5xl font-bold text-sky-800">
                해양 안전 시뮬레이션
              </h1>
            </div>
          </div>

          {/* 게임 시작 버튼 */}
          <div className="animate-fade-in">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartGame}
              className="px-12 py-4 text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              게임 시작하기
            </Button>
            <p className="mt-4 text-sm text-white opacity-70">
              소요시간: 약 5-10분 | 무료 체험
            </p>
          </div>
        </div>

        {/* 하단 안전 정보 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm text-white opacity-70">
            안전한 해양활동을 위한 교육용 시뮬레이션입니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainPage;