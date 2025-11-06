import React from 'react';
import InteractiveBackground from './InteractiveBackground';

interface ManualModeProps {
  sections: { id: string, Comp: React.FC, name: string }[];
  activeIndex: number;
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const ManualMode: React.FC<ManualModeProps> = ({ sections, activeIndex, sectionRefs }) => {
  return (
    <div className="w-full h-full relative">
      {/* The interactive background now lives here, to cover the full screen on the hero section */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${activeIndex === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      >
        <InteractiveBackground />
      </div>

      {sections.map(({ id, Comp }, index) => {
        const offset = index - activeIndex;
        const zIndex = sections.length - Math.abs(offset);

        let transform = '';
        let opacity = 0;

        if (offset === 0) {
          transform = 'translateX(0%) skewX(0deg) scale(1)';
          opacity = 1;
        } else if (offset < 0) {
          transform = 'translateX(-100%) skewX(15deg) scale(0.9)';
          opacity = 0;
        } else { // offset > 0
          transform = 'translateX(100%) skewX(-15deg) scale(0.9)';
          opacity = 0;
        }
        
        return (
          <div
            key={id}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              transform,
              opacity,
              zIndex,
            }}
          >
            <div 
              ref={(el) => { sectionRefs.current[index] = el; }}
              className={`w-full h-full overflow-y-auto p-6 md:p-8 flex justify-center ${index === 0 ? 'items-center' : 'items-start'}`}
            >
              <div className="container mx-auto">
                  <Comp />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManualMode;