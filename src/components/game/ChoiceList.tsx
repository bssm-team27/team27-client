import React, { useState } from 'react';
import type { ChoiceListProps } from '../../types/game';

const ChoiceList: React.FC<ChoiceListProps> = ({
  choices,
  onChoiceSelect,
  disabled = false
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoiceClick = (choiceId: string) => {
    if (disabled || selectedChoice) return;

    setSelectedChoice(choiceId);

    // 선택 후 잠시 시각적 피드백을 보여주고 선택 처리
    setTimeout(() => {
      onChoiceSelect(choiceId);
    }, 500);
  };

  const getSafetyIcon = (rating: number) => {
    if (rating >= 5) return '🛡️';
    if (rating >= 4) return '✅';
    if (rating >= 3) return '⚠️';
    if (rating >= 2) return '❌';
    return '🚫';
  };

  const getSafetyColor = (rating: number) => {
    if (rating >= 5) return 'border-green-400 bg-green-50 hover:bg-green-100';
    if (rating >= 4) return 'border-blue-400 bg-blue-50 hover:bg-blue-100';
    if (rating >= 3) return 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100';
    if (rating >= 2) return 'border-orange-400 bg-orange-50 hover:bg-orange-100';
    return 'border-red-400 bg-red-50 hover:bg-red-100';
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">
          어떻게 하시겠습니까?
        </h3>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
          {choices.map((choice, index) => {
            const isSelected = selectedChoice === choice.id;
            const choiceNumber = String.fromCharCode(65 + index); // A, B, C, ...

            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice.id)}
                disabled={disabled || selectedChoice !== null}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                  ${isSelected
                    ? 'bg-sky-600 border-sky-400 text-white transform scale-105 shadow-2xl'
                    : `bg-white/95 backdrop-blur-sm hover:bg-white text-gray-800 shadow-lg hover:shadow-xl transform hover:scale-102 ${getSafetyColor(choice.safetyRating)}`
                  }
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  animate-slide-up
                `}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* 선택지 번호 */}
                <div className={`
                  absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${isSelected
                    ? 'bg-white text-sky-600'
                    : 'bg-sky-600 text-white'
                  }
                `}>
                  {choiceNumber}
                </div>

                {/* 안전도 표시 */}
                <div className="absolute top-3 right-3 text-xl">
                  {getSafetyIcon(choice.safetyRating)}
                </div>

                <div className="mt-8">
                  <p className={`font-medium leading-relaxed ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {choice.text}
                  </p>

                  {choice.explanation && (
                    <p className={`mt-3 text-sm ${isSelected ? 'text-sky-100' : 'text-gray-600'}`}>
                      {choice.explanation}
                    </p>
                  )}
                </div>

                {/* 선택 완료 표시 */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-sky-600/20 rounded-xl">
                    <div className="bg-white rounded-full p-3 animate-bounce">
                      <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 로딩 중 표시 */}
        {selectedChoice && (
          <div className="mt-6 text-center">
            <p className="text-white font-medium animate-pulse">
              선택을 처리하고 있습니다...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChoiceList;