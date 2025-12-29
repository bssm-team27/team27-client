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
              <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-sky-800">
                해양 안전 시뮬레이션
              </h1>
            </div>
            <p className="text-xl text-sky-700 max-w-2xl mx-auto leading-relaxed">
              실제와 같은 해양 상황에서 안전한 선택을 학습하고,<br />
              AI가 생성하는 몰입도 높은 시나리오를 체험해보세요.
            </p>
          </div>

          {/* 주요 특징들 */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 animate-slide-up">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">실전 시나리오</h3>
              <p className="text-gray-600">해수욕, 낚시, 레저활동 등 실제 상황 기반 시나리오</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">즉시 피드백</h3>
              <p className="text-gray-600">선택한 행동에 대한 안전도 평가와 설명</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">상세 분석</h3>
              <p className="text-gray-600">게임 종료 후 안전 의식 수준 분석 리포트</p>
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
            <p className="mt-4 text-sm text-sky-600">
              소요시간: 약 5-10분 | 무료 체험
            </p>
          </div>
        </div>

        {/* 하단 안전 정보 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm text-sky-600">
            🌊 안전한 해양활동을 위한 교육용 시뮬레이션입니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainPage;