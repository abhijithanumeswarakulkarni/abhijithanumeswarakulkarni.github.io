import React from 'react';

interface RobotProps {
  isThinking: boolean;
  isAwake: boolean;
  isDrowsy: boolean;
}

const Robot: React.FC<RobotProps> = ({ isThinking, isAwake, isDrowsy }) => {
  return (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <svg
        viewBox="-40 0 280 200"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full object-contain ${isThinking ? 'thinking' : ''}`}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="animate-robot-float">
          {/* Body */}
          <g>
            <rect x="70" y="100" width="60" height="50" rx="10" fill="hsl(var(--color-secondary))" stroke="hsl(var(--color-text-secondary))" strokeWidth="2" />
          </g>
          
          {/* Head */}
          <g>
            <path
              d="M 60 40 Q 50 40 50 50 L 50 90 Q 50 100 60 100 L 140 100 Q 150 100 150 90 L 150 50 Q 150 40 140 40 Z"
              fill="hsl(var(--color-secondary))"
              stroke="hsl(var(--color-text-secondary))"
              strokeWidth="2"
            />
            {/* Screen on head */}
            <rect x="65" y="55" width="70" height="30" rx="5" fill="hsl(var(--color-primary))" />
            
            {/* Expressive Eyes */}
            <g className={`robot-eyes-group ${isAwake ? 'awake' : 'sleeping'} ${isDrowsy ? 'drowsy' : ''}`}>
                {/* Left Eye */}
                <g transform="translate(87.5, 70)">
                    <ellipse cx="0" cy="0" rx="8" ry="6" fill="hsl(var(--color-primary))" />
                    <circle cx="0" cy="0" r="2.5" fill="hsl(var(--color-text-primary))" className="pupil" />
                    <path
                        d="M -8 0 A 8 6 0 0 1 8 0 L 8 0 A 8 6 0 0 1 -8 0 Z"
                        fill="hsl(var(--color-secondary))"
                        className="eyelid"
                    />
                </g>
                {/* Right Eye */}
                <g transform="translate(112.5, 70)">
                    <ellipse cx="0" cy="0" rx="8" ry="6" fill="hsl(var(--color-primary))" />
                    <circle cx="0" cy="0" r="2.5" fill="hsl(var(--color-text-primary))" className="pupil" />
                    <path
                        d="M -8 0 A 8 6 0 0 1 8 0 L 8 0 A 8 6 0 0 1 -8 0 Z"
                        fill="hsl(var(--color-secondary))"
                        className="eyelid"
                    />
                </g>
            </g>

            {/* Mouth */}
            <g className="robot-mouth">
              {isDrowsy ? (
                // Yawn mouth (highest priority)
                <path
                  d="M 95 80 Q 100 88 105 80"
                  stroke="hsl(var(--color-text-primary))"
                  strokeWidth="1.5"
                  fill="hsl(var(--color-primary))"
                  strokeLinecap="round"
                  className="yawn"
                />
              ) : !isAwake ? (
                // Sleeping mouth (flat)
                <path
                  d="M 95 81 L 105 81"
                  stroke="hsl(var(--color-text-primary))"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  className="animate-fade-in"
                />
              ) : isThinking ? (
                // Thinking mouth (o)
                <circle
                  cx="100"
                  cy="80"
                  r="3"
                  fill="none"
                  stroke="hsl(var(--color-text-primary))"
                  strokeWidth="1.5"
                  className="animate-fade-in"
                />
              ) : (
                // Awake/Idle mouth (smile)
                <path
                  d="M 95 80 Q 100 83 105 80"
                  stroke="hsl(var(--color-text-primary))"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  className="animate-fade-in"
                />
              )}
            </g>


            {/* Brain/Indicator on top of head */}
             <circle cx="100" cy="50" r="15" fill="hsl(var(--color-primary))" stroke="hsl(var(--color-text-secondary))" strokeWidth="2" className="robot-brain" />
          </g>

          {/* Antenna */}
          <g>
            <line x1="100" y1="40" x2="100" y2="20" stroke="hsl(var(--color-text-secondary))" strokeWidth="2" />
            <circle cx="100" cy="18" r="4" fill="hsl(var(--color-accent))" className="animate-robot-antenna-pulse" />
          </g>

          {/* Sleeping Zs */}
          {!isAwake && (
            <g className="robot-z-group animate-fade-in" transform="translate(150, 25)">
                <text x="0" y="0" dominantBaseline="middle" textAnchor="middle" className="z z-1">z</text>
                <text x="8" y="-8" dominantBaseline="middle" textAnchor="middle" className="z z-2">z</text>
                <text x="16" y="-16" dominantBaseline="middle" textAnchor="middle" className="z z-3">z</text>
            </g>
          )}

          {/* Drowsy Sleepy Dust */}
          {isDrowsy && (
            <g className="sleepy-dust-group">
                <circle cx="80" cy="40" r="1.5" fill="hsl(var(--color-accent))" className="sleepy-dust dust-1" />
                <circle cx="95" cy="38" r="1" fill="hsl(var(--color-accent))" className="sleepy-dust dust-2" />
                <circle cx="115" cy="42" r="1.5" fill="hsl(var(--color-accent))" className="sleepy-dust dust-3" />
                <circle cx="88" cy="35" r="1.2" fill="hsl(var(--color-accent))" className="sleepy-dust dust-4" />
                <circle cx="108" cy="36" r="1" fill="hsl(var(--color-accent))" className="sleepy-dust dust-5" />
            </g>
          )}

          {/* Thinking Cloud */}
          {isThinking && (
            <g className="animate-fade-in" transform="translate(110, -20)">
              <g className="animate-cloud-bob">
                <path
                  d="M25.5,22.9c-0.4-3.1-3-5.5-6.2-5.5c-3.4,0-6.2,2.8-6.2,6.2c0,0.9,0.2,1.8,0.6,2.6c-2.2-0.2-4.2,1.2-4.6,3.4 c-0.4,2.4,1.2,4.6,3.6,5c0,0,0.1,0,0.1,0h18.3c2.7,0,4.9-2.2,4.9-4.9C30.9,25.3,28.5,22.9,25.5,22.9z"
                  transform="scale(3.0)"
                  fill="hsl(var(--color-secondary))"
                  stroke="hsl(var(--color-text-secondary))"
                  strokeWidth="0.5"
                />
                <text
                  x="66"
                  y="81"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="6"
                  fill="hsl(var(--color-text-primary))"
                  fontFamily="Inter, sans-serif"
                  fontWeight="bold"
                >
                  Thinking...
                </text>
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default Robot;
