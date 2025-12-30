import React, {useMemo, useState} from 'react';
import { useGameStore } from '../stores/gameStore';
import { Button, LoadingSpinner } from '../components/ui';
import type { ParticipantType, ActivityType } from '../types/game';
import { getRandomBackground } from '../utils/randomBackground';

const GameSetupPage: React.FC = () => {
  const { gameState, createGame, setCurrentPage } = useGameStore();
  const [participants, setParticipants] = useState<ParticipantType>('single');
  const [activity, setActivity] = useState<ActivityType>('swimming');

  const isLoading = gameState?.isLoading && gameState?.loadingType === 'game-creating';

  const handleBack = () => {
    setCurrentPage('main');
  };

  const handleStartGame = async () => {
    await createGame({ participants, activity });
  };
  const backgroundImage = useMemo(() => getRandomBackground(), []);
  const participantOptions = [
    { value: 'single' as ParticipantType, label: '혼자', description: '1인 활동 시나리오', icon: '🧑‍🦲' },
    { value: 'double' as ParticipantType, label: '둘이서', description: '2인 활동 시나리오', icon: '👫' },
    { value: 'group' as ParticipantType, label: '단체로', description: '그룹 활동 시나리오', icon: '👥' }
  ];

  const activityOptions = [
    {
      value: 'swimming' as ActivityType,
      label: '해수욕',
      description: '해변에서의 물놀이와 수영',
      icon: '🏊‍♂️',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      value: 'fishing' as ActivityType,
      label: '낚시',
      description: '바다 낚시와 방파제 활동',
      icon: '🎣',
      color: 'bg-green-500',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      value: 'leisure' as ActivityType,
      label: '레저활동',
      description: '수상스키, 제트스키 등 레저스포츠',
      icon: '🏄‍♂️',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="card p-12 text-center max-w-md">
          <LoadingSpinner size="lg" message="AI가 맞춤형 시나리오를 생성하고 있습니다..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 animate-fade-in">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            메인으로 돌아가기
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">게임 설정</h1>
          <p className="text-white">상황을 선택하면 AI가 맞춤형 시나리오를 생성합니다</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 참가자 수 선택 */}
          <div className="card p-8 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sky-600 font-bold">1</span>
              </div>
              참가자 수
            </h2>
            <div className="space-y-4">
              {participantOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${participants === option.value
                      ? 'border-sky-500 bg-sky-50 shadow-md'
                      : 'border-gray-200 hover:border-sky-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="participants"
                    value={option.value}
                    checked={participants === option.value}
                    onChange={(e) => setParticipants(e.target.value as ParticipantType)}
                    className="sr-only"
                  />
                  <div className="text-2xl mr-4">{option.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                  {participants === option.value && (
                    <div className="text-sky-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* 활동 선택 */}
          <div className="card p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sky-600 font-bold">2</span>
              </div>
              활동 종류
            </h2>
            <div className="space-y-4">
              {activityOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 transform
                    ${activity === option.value
                      ? 'border-sky-500 bg-sky-50 shadow-lg scale-105'
                      : `border-gray-200 hover:border-sky-300 hover:shadow-md ${option.bgColor}`
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="activity"
                    value={option.value}
                    checked={activity === option.value}
                    onChange={(e) => setActivity(e.target.value as ActivityType)}
                    className="sr-only"
                  />
                  <div className="text-3xl mr-4">{option.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-lg">{option.label}</div>
                    <div className="text-gray-600">{option.description}</div>
                  </div>
                  {activity === option.value && (
                    <div className="text-sky-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 게임 생성 버튼 */}
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Button
              variant="primary"
              size="lg"
              onClick={handleStartGame}
              className="
                px-16 py-4 text-lg
                !bg-black/30 !text-white
                hover:!bg-black/15
                shadow-xl hover:shadow-2xl
                transform hover:-translate-y-1
                transition-all duration-300
              " >
            시나리오 생성하기
          </Button>
          <p className="mt-4 text-sm text-white">
            선택한 설정을 바탕으로 맞춤형 시나리오가 생성됩니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameSetupPage;