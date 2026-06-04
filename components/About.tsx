import React from 'react';
import { useInView } from './hooks/useInView';
import profileImg from '../assets/profile.png';

const charStats = [
  { k: 'NAME',      v: 'Abhijit H. Kulkarni' },
  { k: 'CLASS',     v: 'Full Stack Engineer' },
  { k: 'DEGREE',    v: 'Computer Science Graduate' },
  { k: 'SCHOOL',    v: 'Univ. of Southern California' },
  { k: 'GRADUATED', v: 'May 2026' },
  { k: 'STATUS',    v: 'Open to Opportunities' },
];

const About: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-28 px-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-6xl mx-auto">
        <p className="slabel mb-2">// Profile</p>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-g-text tracking-wide mb-12">Character Sheet</h2>

        <div className="grid md:grid-cols-5 gap-8 items-start">

          {/* Portrait */}
          <div className="md:col-span-2 flex justify-center md:justify-start">
            <div className="gf4 p-1 w-full max-w-xs">
              <img
                src={profileImg}
                alt="Abhijit Hanumeswara Kulkarni"
                className="w-full object-cover aspect-[3/4]"
              />
            </div>
          </div>

          {/* Stats panel */}
          <div className="md:col-span-3 space-y-5">
            {/* Character stats table */}
            <div className="gf p-5 space-y-0 divide-y divide-g-border/30">
              {charStats.map(({ k, v }) => (
                <div key={k} className="flex items-center gap-4 py-2.5 first:pt-0 last:pb-0">
                  <span className="font-mono text-xs text-g-gold/65 tracking-widest w-24 flex-shrink-0">{k}</span>
                  <span className={`font-raj font-semibold text-g-text ${k === 'STATUS' ? 'text-g-green' : ''}`}>{v}</span>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="space-y-3 text-g-muted font-raj text-base leading-relaxed pt-1">
              <p>
                Hello! I'm <span className="text-g-text font-semibold">Abhijit</span>, a{' '}
                <span className="text-g-text font-semibold">Computer Science graduate</span> (M.S., USC — May 2026)
                and Full Stack Engineer.
              </p>
              <p>
                With experience at <span className="font-mono text-g-gold text-sm">Morgan Stanley</span> and{' '}
                <span className="font-mono text-g-gold text-sm">Juspay</span>, I've built real-time dashboards,
                micro-frontend architectures, and notification platforms at scale.
              </p>
              <p>I thrive at the intersection of clean UI and solid backend design.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
