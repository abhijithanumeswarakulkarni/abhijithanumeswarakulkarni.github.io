import React from 'react';
import { useInView } from './hooks/useInView';
import universityImg from '../assets/university.png';

const Education: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section
      id="education"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-28 px-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ background: 'linear-gradient(180deg, rgb(8,12,20) 0%, rgb(11,17,28) 50%, rgb(8,12,20) 100%)' }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="slabel mb-2">// Backstory</p>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-g-text tracking-wide mb-12">Origins</h2>

        <div className="grid md:grid-cols-5 gap-8 items-center">

          {/* Card */}
          <div className="md:col-span-3">
            <div className="gf4 p-6 space-y-5">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/5 border border-g-border/60 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src="https://img.logo.dev/usc.edu?token=pk_XFuxQT5RQj6fYiG8k5sbBQ"
                    alt="USC"
                    className="w-10 h-10 object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-g-text leading-snug">
                    University of Southern California
                  </h3>
                  <p className="font-mono text-g-gold text-sm mt-1">M.S. Computer Science</p>
                  <p className="font-mono text-xs text-g-muted mt-0.5">Aug 2024 – May 2026 · Los Angeles, CA</p>
                </div>
              </div>

              <div className="gdiv" />

              {/* Lore */}
              <div className="border-l-2 border-g-gold/25 pl-4 space-y-2.5 text-g-muted font-raj leading-relaxed">
                <p>
                  Deepening expertise with focus on{' '}
                  <span className="text-g-text font-medium">Analysis of Algorithms</span> and{' '}
                  <span className="text-g-text font-medium">Multimedia Systems Design</span>.
                </p>
                <p>Applying advanced theoretical knowledge to real-world engineering challenges.</p>
              </div>

              {/* Course tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['Analysis of Algorithms', 'Multimedia Systems Design'].map(c => (
                  <span key={c} className="font-mono text-xs border border-g-gold/25 text-g-gold/65 px-3 py-1.5">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <div className="gf p-1">
              <img
                src={universityImg}
                alt="University of Southern California"
                className="w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
