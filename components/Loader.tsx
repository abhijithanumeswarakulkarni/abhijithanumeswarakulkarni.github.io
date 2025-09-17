import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Initializing AI Core...",
  "Booting Neural Networks...",
  "Calibrating Quantum Flux...",
  "Loading Portfolio Matrix...",
  "Assembling Digital Consciousness...",
  "Finalizing Connections..."
];

const LOADER_DURATION = 3000; // 3 seconds

const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Effect for cycling messages
  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setMessageIndex(prevIndex => (prevIndex + 1));
      }, LOADER_DURATION / loadingMessages.length); // Cycle through all messages during the load time

      return () => clearInterval(interval);
    }
  }, [progress]);

  // Effect for progress bar
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const currentProgress = Math.min(100, (elapsedTime / LOADER_DURATION) * 100);
      setProgress(currentProgress);
      
      if (elapsedTime < LOADER_DURATION) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setProgress(100);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary">
      {/* New Loader Animation */}
      <div className="loader-container mb-6" aria-label="Loading animation">
        <div className="loader-orb"></div>
        <div className="loader-particle particle-1"></div>
        <div className="loader-particle particle-2"></div>
        <div className="loader-particle particle-3"></div>
        <div className="loader-particle particle-4"></div>
      </div>
      
      {/* Progress Percentage */}
      <p className="text-4xl font-black text-text-primary mb-4 font-mono tabular-nums">
        {Math.floor(progress)}%
      </p>

      {/* Loading Messages */}
      <div className="relative h-6 w-72 overflow-hidden text-center">
        {loadingMessages.map((msg, index) => (
            <p
                key={index}
                className={`absolute w-full text-text-secondary transition-all duration-500 ease-in-out ${index === messageIndex % loadingMessages.length ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
                style={{ transitionDelay: index === messageIndex % loadingMessages.length ? '150ms' : '0ms' }}
            >
                {msg}
            </p>
        ))}
      </div>
    </div>
  );
};

export default Loader;