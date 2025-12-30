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

  return (
    <div className="w-full flex justify-center p-6 bg-transparent">
      <div className="max-w-4xl w-full">
        <h3 className="text-xl font-semibold text-white mb-6 text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
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
                    ? 'bg-white text-gray-900 border-white shadow-2xl scale-105'
                    : 'bg-white/15 text-white border-white/35 hover:border-white hover:bg-white/25 shadow-lg hover:shadow-xl hover:scale-[1.02]'
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
                    ? 'bg-gray-900 text-white'
                    : 'bg-white/25 text-white border border-white/40'
                  }
                `}>
                  {choiceNumber}
                </div>

                <div className="mt-8">
                  <p className={`font-medium leading-relaxed ${isSelected ? 'text-gray-900' : 'text-white'}`}>
                    {choice.text}
                  </p>
                </div>

                {/* 선택 완료 표시 */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-xl">
                    <div className="bg-gray-900 rounded-full p-3 animate-bounce">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
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
