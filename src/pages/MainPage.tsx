import React, { useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getRandomBackground } from '../utils/randomBackground';
import Arrow from "../assets/arrow.svg"

const MainPage: React.FC = () => {
  const setCurrentPage = useGameStore(state => state.setCurrentPage);
  const backgroundImage = useGameStore(state => state.backgroundImage);

  const selectedBackground = useMemo(
    () => backgroundImage ?? getRandomBackground(),
    [backgroundImage]
  );

  const handleStartGame = () => {
    setCurrentPage('setup');
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${selectedBackground})` }}
      onClick={handleStartGame}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* 헤더 */}
          <div className="flex flex-col items-center mb-2">
              <h1 className="text-7xl font-bold text-white mb-10">
                  그날, 바다는 선택을 요구했다
              </h1>
            <div>
                <h1 className="text-3xl font-bold text-white/80">
                  화면을 클릭해서 게임을 시작하세요
                </h1>
                <p className="mt-4 text-sm text-white opacity-70 mb-2">
                  소요시간: 약 5-10분 | 무료 체험
                </p>
            </div>
            <img className="w-10 arrow-float" src={Arrow} alt={"화살표"}/>
          </div>

      </div>

      {/* 하단 안전 정보 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-sm text-white opacity-70">
          안전한 해양활동을 위한 교육용 시뮬레이션입니다
        </p>

      </div>
    </div>
  );
};

export default MainPage;
