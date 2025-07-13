import React, { useState, useEffect, useRef } from 'react';

interface LoadingScreenProps {
  progress: number; // 0-100
  visible: boolean;
  goals?: string[];
  backgroundImage?: string;
  onLoadingComplete?: () => void;
}

const loaderImages = [
  "/images/loader/ian-fox-empty-treasury.jpg",
  "/images/loader/ian-fox-lower-landing.jpg",
  "/images/loader/ian-fox-upper-landing.jpg",
  "/images/loader/ian-fox-store-room.jpg",
  "/images/loader/ian-fox-castle-exterior.jpg",
  "/images/loader/ian-fox-castle-makeshift-kitchen.jpg",
  "/images/loader/ian-fox-rainforest-room.jpg"
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, visible, goals, onLoadingComplete }) => {
  // Only pick a random image once per loader session
  const imageRef = useRef(loaderImages[Math.floor(Math.random() * loaderImages.length)]);
  const [waiting, setWaiting] = useState(false);
  const [split, setSplit] = useState(false);
  const [shouldShow, setShouldShow] = useState(visible); // Initialize to match the visible prop

  // When progress hits 100%, wait 1 second, then start split animation, then call onLoadingComplete
  useEffect(() => {
    if (progress >= 100 && visible && !waiting && !split) {
      setWaiting(true);
      setTimeout(() => {
        // First set split to true to start the animation
        setSplit(true);
        
        // Wait a short time to ensure the split animation starts
        setTimeout(() => {
          // Call onLoadingComplete to show content underneath while split is happening
          if (onLoadingComplete) onLoadingComplete();
          
          // Keep the split animation visible for a while
          setTimeout(() => {
            setShouldShow(false); // Remove loader after split animation completes
            setSplit(false);
          }, 2000); // Keep split visible for 2 seconds
        }, 100); // Small delay to ensure split animation starts
        
        setWaiting(false);
      }, 1000); // wait 1s at 100%
    }
  }, [progress, visible, waiting, split, onLoadingComplete]);

  // Also update shouldShow when visible prop changes
  useEffect(() => {
    setShouldShow(visible);
  }, [visible]);

  // Only show loader when visible, waiting, splitting, or shouldShow
  if (!visible && !waiting && !split && !shouldShow) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
    >
      {/* Split background image */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        {/* Left half */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            backgroundImage: `url(${imageRef.current})`,
            backgroundSize: '200% 100%',
            backgroundPosition: 'left center',
            transition: split ? 'transform 1s cubic-bezier(0.65, 0, 0.35, 1)' : 'none',
            transform: split ? 'translateX(-100%)' : 'translateX(0)',
          }}
        />
        {/* Right half */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            backgroundImage: `url(${imageRef.current})`,
            backgroundSize: '200% 100%',
            backgroundPosition: 'right center',
            transition: split ? 'transform 1s cubic-bezier(0.65, 0, 0.35, 1)' : 'none',
            transform: split ? 'translateX(100%)' : 'translateX(0)',
          }}
        />
      </div>
      {/* Goals and progress UI */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          minWidth: 320,
          maxWidth: 440,
          minHeight: 180,
          background: 'linear-gradient(135deg, #f8ecd0 80%, #e2c792 100%)',
          border: '4px solid #d2b47d',
          borderRadius: 18,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          padding: '32px 28px 28px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: split ? 0 : 1,
          transition: 'opacity 0.8s ease-out',
        }}
      >
        {goals && goals.length > 0 ? (
          <>
            <h2 style={{ color: '#7c4a03', marginBottom: 10, fontSize: 26, fontWeight: 800, letterSpacing: 1, textShadow: '0 2px 8px #fff8' }}>Goals</h2>
            <ul style={{ marginBottom: 24, listStyle: 'none', padding: 0, textAlign: 'left', width: '100%', maxWidth: 340 }}>
              {goals.map((goal, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    marginTop: 6,
                    marginRight: 12,
                    background: '#fbbf24',
                    borderRadius: '50%',
                    boxShadow: '0 1px 4px #fff8',
                    flexShrink: 0
                  }} />
                  <span style={{ color: '#3d2600', fontSize: 18, fontWeight: 500, textShadow: '0 1px 4px #fff8' }}>{goal}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h2 style={{ color: '#7c4a03', marginBottom: 28, fontSize: 28, fontWeight: 800, letterSpacing: 1, textShadow: '0 2px 8px #fff8' }}>Loading...</h2>
        )}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 280, height: 22, background: '#e5d3b3', borderRadius: 11, border: '2.5px solid #b48a4a', overflow: 'hidden', marginBottom: 10, boxShadow: '0 2px 8px #0002' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)',
                transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: '0 0 8px #fbbf24cc',
              }}
            />
          </div>
          <span style={{ color: '#7c4a03', fontSize: 18, fontWeight: 700, textShadow: '0 2px 8px #fff8' }}>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 