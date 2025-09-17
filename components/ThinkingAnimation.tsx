import React from 'react';

const ThinkingAnimation: React.FC = () => {
  return (
    <div className="flex items-end gap-2 justify-start animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-accent text-primary flex-shrink-0 flex items-center justify-center font-bold text-sm">AI</div>
      <div className="max-w-md p-3 rounded-lg bg-primary">
        <div className="flex items-center gap-3">
          <div className="relative w-5 h-5 flex items-center justify-center">
            <div className="absolute w-full h-full bg-accent rounded-full animate-pulse-glow opacity-50"></div>
            <div className="absolute w-2/3 h-2/3 bg-accent rounded-full animate-pulse-glow" style={{ animationDelay: '0.75s' }}></div>
          </div>
          <p className="text-sm text-text-secondary">Thinking...</p>
        </div>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
