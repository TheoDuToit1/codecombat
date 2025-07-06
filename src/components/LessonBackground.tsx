import React from 'react';

interface LessonBackgroundProps {
  lessonNumber?: number;
}

export const LessonBackground: React.FC<LessonBackgroundProps> = ({ lessonNumber }) => {
  // Default background styles
  const backgroundStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
    opacity: 0.7,
  };

  // For lessons 1 and 2, use the im1.jpg image
  if (lessonNumber === 1 || lessonNumber === 2) {
    return (
      <div 
        style={{
          ...backgroundStyles,
          backgroundImage: `url(/images/im1.jpg)`,
          filter: lessonNumber === 1 ? 'brightness(0.9) saturate(1.1)' : 'brightness(0.85) sepia(0.1)',
        }}
      />
    );
  }

  // For lessons 3 and 4, use the im-2.jpg image
  if (lessonNumber === 3 || lessonNumber === 4) {
    return (
      <div 
        style={{
          ...backgroundStyles,
          backgroundImage: `url(/images/im-2.jpg)`,
          filter: 'brightness(0.92) saturate(1.08)',
        }}
      />
    );
  }

  // For other lessons, use a gradient background
  return (
    <div 
      style={{
        ...backgroundStyles,
        background: `linear-gradient(135deg, #1a2a3a 0%, #0f172a 100%)`,
      }}
    />
  );
};

export default LessonBackground; 