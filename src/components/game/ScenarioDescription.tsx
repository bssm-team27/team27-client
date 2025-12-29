import React, { useState, useEffect } from 'react';
import type { ScenarioDescriptionProps } from '../../types/game';

const ScenarioDescription: React.FC<ScenarioDescriptionProps> = ({
  title,
  description,
  isVisible
}) => {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedDescription, setDisplayedDescription] = useState('');
  const [titleComplete, setTitleComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setDisplayedTitle('');
      setDisplayedDescription('');
      setTitleComplete(false);
      return;
    }

    // 타이핑 효과를 위한 타이틀 애니메이션
    let titleIndex = 0;
    const titleInterval = setInterval(() => {
      if (titleIndex < title.length) {
        setDisplayedTitle(title.slice(0, titleIndex + 1));
        titleIndex++;
      } else {
        clearInterval(titleInterval);
        setTitleComplete(true);
      }
    }, 50);

    return () => clearInterval(titleInterval);
  }, [title, isVisible]);

  useEffect(() => {
    if (!titleComplete || !isVisible) {
      setDisplayedDescription('');
      return;
    }

    // 타이틀 완료 후 설명 애니메이션
    let descIndex = 0;
    const descTimeout = setTimeout(() => {
      const descInterval = setInterval(() => {
        if (descIndex < description.length) {
          setDisplayedDescription(description.slice(0, descIndex + 1));
          descIndex++;
        } else {
          clearInterval(descInterval);
        }
      }, 30);
    }, 300);

    return () => clearTimeout(descTimeout);
  }, [description, titleComplete, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-6 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-sky-800 mb-6 text-center">
          {displayedTitle}
          {displayedTitle.length < title.length && (
            <span className="animate-pulse">|</span>
          )}
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed text-center">
          {displayedDescription}
          {titleComplete && displayedDescription.length < description.length && (
            <span className="animate-pulse">|</span>
          )}
        </p>

        {/* 클릭하여 계속하기 안내 */}
        {titleComplete && displayedDescription.length === description.length && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-sm text-sky-600 animate-pulse">
              화면을 클릭하여 선택지를 확인하세요
            </p>
            <div className="mt-2">
              <svg className="w-6 h-6 mx-auto text-sky-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioDescription;