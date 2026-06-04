import React, { useState, useEffect, useRef } from 'react';
import type { Theme } from './themes';

interface Props {
  theme: Theme;       // the season being entered
  onDone: () => void; // fired when the wipe completes
}

const SeasonTransition: React.FC<Props> = ({ theme, onDone }) => {
  const [pct, setPct]   = useState(0);
  const [fade, setFade] = useState(false);
  const calledRef       = useRef(false);

  useEffect(() => {
    const start = performance.now();
    const DUR = 1300;
    let raf = 0;
    const tick = () => {
      const p = Math.min(100, ((performance.now() - start) / DUR) * 100);
      setPct(Math.round(p));
      if (p < 100) { raf = requestAnimationFrame(tick); }
      else {
        setFade(true);
        setTimeout(() => { if (!calledRef.current) { calledRef.current = true; onDone(); } }, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.id]);

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: '#080A0E',            // solid, fully opaque base — nothing shows through
        transition: 'opacity 0.3s ease',
        opacity: fade ? 0 : 1,
      }}
    >
      {/* Accent glow sits on top of the opaque base */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 40%, ${theme.accentDark}, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.18) 3px,rgba(0,0,0,0.18) 4px)' }} />

      {/* Big season icon */}
      <div className="text-6xl mb-5" style={{ filter: `drop-shadow(0 0 18px ${theme.accent})` }}>
        {theme.icon}
      </div>

      <p className="font-mono text-xs tracking-[0.4em] mb-2" style={{ color: theme.accent }}>
        CHANGING SEASON
      </p>
      <h2 className="font-cinzel font-black tracking-widest mb-1"
        style={{ fontSize: 'clamp(2rem,7vw,4rem)', color: '#fff', textShadow: `0 0 24px ${theme.accent}, 0 4px 0 ${theme.accentDark}` }}>
        {theme.season}
      </h2>
      <p className="font-cinzel tracking-[0.25em] mb-8" style={{ color: theme.accent, fontSize: 14 }}>
        ENTERING THE {theme.world}
      </p>

      {/* Progress bar */}
      <div className="w-64 h-3" style={{ background: 'rgba(0,0,0,0.3)', border: `2px solid ${theme.accent}66` }}>
        <div className="h-full transition-all duration-100"
          style={{ width: `${pct}%`, background: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }} />
      </div>
      <p className="font-mono text-xs mt-2" style={{ color: '#fff', opacity: 0.7 }}>{pct}%</p>
    </div>
  );
};

export default SeasonTransition;
