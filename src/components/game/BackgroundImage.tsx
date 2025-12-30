import React, { useState, useEffect } from 'react';
import type { BackgroundImageProps } from '../../types/game';
import LoadingSpinner from '../ui/LoadingSpinner';

const BackgroundImage: React.FC<BackgroundImageProps> = ({
  imageUrl,
  altText,
  isLoading = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // imageUrl이 변경되면 상태 리셋
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [imageUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // 에러 발생 시 폴백 UI
  if (imageError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-500 flex items-center justify-center">
        <div className="text-center text-white">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-70" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">이미지를 불러올 수 없습니다</p>
          <p className="text-sm opacity-75">기본 해양 배경을 사용합니다</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 이미지가 로드되기 전 로딩 UI */}
      {(isLoading || !imageLoaded) && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-500">
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="lg" message="배경 이미지 로딩 중..." />
          </div>
        </div>
      )}

      {/* 이미지는 항상 렌더링 (숨겨진 상태로 로드) */}
      <img
        src={imageUrl}
        alt={altText}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* 이미지 로드 완료 시 오버레이 그라디언트 */}
      {imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      )}
    </>
  );
};

export default BackgroundImage;