import React, { useState, useEffect, useRef } from 'react';
import type { Portal } from './gameData';

interface Props {
  portal:     Portal;
  onComplete: () => void; // fired when fade-OUT starts → panel can begin appearing
  onGone:     () => void; // fired after fade-out finishes → safe to unmount
}

const LocationTransition: React.FC<Props> = ({ portal, onComplete, onGone }) => {
  const [visible, setVisible] = useState(false);
  const [letters, setLetters] = useState(0);
  const [barFill, setBarFill] = useState(0);
  const [exiting, setExiting] = useState(false);
  const calledRef             = useRef(false);

  useEffect(() => {
    calledRef.current = false;
    setVisible(false); setLetters(0); setBarFill(0); setExiting(false);

    // Phase 1 – overlay fade-in (200ms CSS transition)
    const t1 = setTimeout(() => setVisible(true), 10);

    // Phase 2 – type letters starting after overlay appears
    const t2 = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setLetters(i);
        setBarFill(Math.round((i / portal.label.length) * 100));
        if (i >= portal.label.length) clearInterval(iv);
      }, 38);
    }, 220);

    // Phase 3 – begin fade-out; fire onComplete NOW so panel mounts & cross-fades
    const holdMs = 220 + portal.label.length * 38 + 440;
    const t3 = setTimeout(() => {
      if (calledRef.current) return;
      calledRef.current = true;
      setExiting(true);
      onComplete();                     // panel starts mounting here
      setTimeout(onGone, 320);          // tell App we are fully gone
    }, holdMs);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portal.id]);

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center pointer-events-none"
      style={{
        background: 'rgba(4,8,14,0.97)',
        transition: exiting ? 'opacity 0.32s ease' : 'opacity 0.18s ease',
        opacity: visible && !exiting ? 1 : 0,
      }}
    >
      {/* Scanline sweep */}
      <div className="absolute left-0 right-0 h-24 pointer-events-none"
        style={{
          background: `linear-gradient(transparent, ${portal.color}22, transparent)`,
          animation: 'scanline 2.2s linear infinite',
          top: 0,
        }}
      />

      <div className="flex flex-col items-center gap-5 px-8">
        <p className="font-mono text-xs tracking-[0.45em] uppercase"
          style={{ color: portal.color, opacity: 0.8, animation: 'fade-up 0.3s 0.1s ease both' }}>
          Entering Location
        </p>

        {/* Letter-by-letter name */}
        <div className="relative">
          <h2 className="font-cinzel font-black text-center leading-none"
            style={{
              fontSize: 'clamp(2rem,7vw,4.5rem)',
              letterSpacing: '0.08em',
              color: portal.bright,
              textShadow: `0 0 30px ${portal.color}, 0 0 60px ${portal.color}44`,
            }}>
            {portal.label.slice(0, letters)}
            {letters < portal.label.length && (
              <span style={{ opacity: 0.5, animation: 'blink 0.4s step-end infinite' }}>█</span>
            )}
          </h2>
          {/* Growing underline */}
          <div className="mt-2 h-0.5 transition-all duration-[45ms]"
            style={{
              width: `${barFill}%`,
              background: portal.color,
              boxShadow: `0 0 8px ${portal.color}`,
              margin: '8px auto 0',
            }}
          />
        </div>

        {/* Segment bars */}
        <div className="flex gap-1.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-1 transition-all duration-75"
              style={{
                width:      i < Math.round(barFill / 10) ? 20 : 7,
                background: i < Math.round(barFill / 10) ? portal.color : 'rgba(30,48,85,0.4)',
                boxShadow:  i < Math.round(barFill / 10) ? `0 0 6px ${portal.color}` : 'none',
              }}
            />
          ))}
        </div>

        {letters >= portal.label.length && (
          <p className="font-mono text-xs tracking-widest"
            style={{ color: 'rgba(122,142,168,0.45)', animation: 'fade-up 0.25s ease forwards' }}>
            Loading area data...
          </p>
        )}
      </div>

      {/* Corner brackets */}
      {[
        { top: 24, left: 24,  style: { borderTop: `2px solid ${portal.color}70`, borderLeft: `2px solid ${portal.color}70` } },
        { top: 24, right: 24, style: { borderTop: `2px solid ${portal.color}70`, borderRight: `2px solid ${portal.color}70` } },
        { bottom: 24, left: 24,  style: { borderBottom: `2px solid ${portal.color}70`, borderLeft: `2px solid ${portal.color}70` } },
        { bottom: 24, right: 24, style: { borderBottom: `2px solid ${portal.color}70`, borderRight: `2px solid ${portal.color}70` } },
      ].map((b, i) => (
        <div key={i} className="absolute w-8 h-8 pointer-events-none"
          style={{ top: b.top, bottom: b.bottom, left: b.left, right: b.right, ...b.style }} />
      ))}
    </div>
  );
};

export default LocationTransition;
