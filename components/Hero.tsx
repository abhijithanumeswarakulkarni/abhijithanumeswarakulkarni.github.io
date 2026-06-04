import React, { useState, useEffect } from 'react';
import InteractiveBackground from './InteractiveBackground';

const roles = [
  'Full Stack Engineer',
  'MS CS @ USC',
  'AI Systems Builder',
  'Open to Opportunities',
];

const Hero: React.FC = () => {
  const [idx, setIdx]             = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    const current = roles[idx];
    let t: number;
    if (!deleting && displayed.length < current.length) {
      t = window.setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75);
    } else if (!deleting && displayed.length === current.length) {
      t = window.setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      t = window.setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 38);
    } else {
      setDeleting(false);
      setIdx(i => (i + 1) % roles.length);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, idx]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Boids */}
      <div className="absolute inset-0 opacity-[0.18] pointer-events-none">
        <InteractiveBackground />
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,162,20,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-36 w-full">
        <div className="max-w-3xl">

          {/* Label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-g-gold/40" />
            <span className="slabel">Player Profile</span>
            <div className="w-8 h-px bg-g-gold/40" />
          </div>

          {/* Name */}
          <h1 className="font-cinzel font-black leading-none mb-3 tracking-wide">
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-[6rem] tglow">
              ABHIJIT
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl text-g-muted font-normal tracking-[0.18em] mt-2">
              HANUMESWARA KULKARNI
            </span>
          </h1>

          <div className="gdiv my-6" />

          {/* Typing role */}
          <div className="font-mono text-base sm:text-lg text-g-gold mb-10 h-7 flex items-center gap-2">
            <span className="text-g-muted/60 text-sm">CLASS:</span>
            <span>{displayed}</span>
            <span className="cursor" />
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-5 mb-12">
            {[
              { k: 'EXP',    v: '4+ Years' },
              { k: 'QUESTS', v: '10+ Projects' },
              { k: 'GUILDS', v: '3 Companies' },
            ].map(({ k, v }) => (
              <div key={k} className="flex items-center gap-2">
                <span className="font-mono text-xs text-g-muted">{k}:</span>
                <span className="font-raj font-semibold text-g-text">{v}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a href="#experience" onClick={scrollTo('#experience')} className="gbtn gbtn-solid">
              <span>View Quests</span>
            </a>
            <a href="assets/files/resume.pdf" download className="gbtn">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Resume</span>
            </a>
            <a href="https://github.com/abhijithanumeswarakulkarni" target="_blank" rel="noopener noreferrer" className="gbtn gbtn-dim">
              <span>GitHub ↗</span>
            </a>
            <a href="https://www.linkedin.com/in/abhijit-h-kulkarni/" target="_blank" rel="noopener noreferrer" className="gbtn gbtn-dim">
              <span>LinkedIn ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="slabel tracking-[0.35em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-g-gold/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
};

export default Hero;
