import React, { useEffect, useRef } from 'react';
import About from './About';
import Education from './Education';
import Experience from './Experience';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';
import { PORTALS } from './gameData';

interface Props {
  locationId: string | null;
  onClose:    () => void;
  onNavigate: (id: string) => void;
}

const SECTIONS: Record<string, React.ReactNode> = {
  about:      <About />,
  education:  <Education />,
  experience: <Experience />,
  projects:   <Projects />,
  skills:     <Skills />,
  contact:    <Contact />,
};

const SectionPanel: React.FC<Props> = ({ locationId, onClose, onNavigate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top when section changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [locationId]);

  // Escape to close
  useEffect(() => {
    if (!locationId) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [locationId, onClose]);

  if (!locationId) return null;

  const portal  = PORTALS.find(p => p.id === locationId);
  const content = SECTIONS[locationId];
  if (!content) return null;

  return (
    /*
     * Outer backdrop: ALWAYS fully opaque on mount — no fade transition.
     * This ensures the game world is covered the instant React renders this
     * component, even while the LocationTransition is still fading out.
     * Only the inner panel box gets an entrance animation.
     */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(4,8,14,0.93)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel box — scale-in animation only */}
      <div
        className="relative w-full flex flex-col anim-scale-in-panel"
        style={{
          maxWidth:   960,
          maxHeight:  '90vh',
          background: 'rgb(8,12,20)',
          border:     `1px solid ${portal?.color ?? 'rgba(232,162,20,0.25)'}55`,
          boxShadow:  `0 0 40px ${portal?.color ?? '#e8a214'}1a, 0 0 80px ${portal?.color ?? '#e8a214'}0a`,
        }}
      >
        {/* Four corner brackets */}
        {(['tl','tr','bl','br'] as const).map(c => (
          <div key={c} className="absolute w-5 h-5 pointer-events-none"
            style={{
              top:    c[0] === 't' ? 0 : undefined,
              bottom: c[0] === 'b' ? 0 : undefined,
              left:   c[1] === 'l' ? 0 : undefined,
              right:  c[1] === 'r' ? 0 : undefined,
              borderTop:    c[0] === 't' ? `2px solid ${portal?.bright ?? '#f5c842'}` : undefined,
              borderBottom: c[0] === 'b' ? `2px solid ${portal?.bright ?? '#f5c842'}` : undefined,
              borderLeft:   c[1] === 'l' ? `2px solid ${portal?.bright ?? '#f5c842'}` : undefined,
              borderRight:  c[1] === 'r' ? `2px solid ${portal?.bright ?? '#f5c842'}` : undefined,
            }}
          />
        ))}

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${portal?.color ?? 'rgba(232,162,20,0.2)'}40`,
            animation: 'slide-down 0.35s 0.05s ease both',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rotate-45 flex-shrink-0"
              style={{ background: portal?.bright ?? '#f5c842' }} />
            <span className="font-cinzel text-sm font-bold tracking-widest"
              style={{ color: portal?.bright ?? '#f5c842' }}>
              {portal?.label ?? locationId.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Section dot nav */}
            {PORTALS.map(p => (
              <button
                key={p.id}
                title={p.label}
                onClick={e => { e.stopPropagation(); onNavigate(p.id); }}
                className="rounded-full transition-all duration-200"
                style={{
                  width:     p.id === locationId ? 10 : 7,
                  height:    p.id === locationId ? 10 : 7,
                  background: p.id === locationId
                    ? (portal?.bright ?? '#f5c842')
                    : p.color + '70',
                  boxShadow: p.id === locationId
                    ? `0 0 8px ${portal?.bright}`
                    : 'none',
                }}
              />
            ))}

            <button
              onClick={onClose}
              className="ml-3 font-mono text-xs border px-3 py-1 transition-all duration-200"
              style={{ borderColor: 'rgba(122,142,168,0.3)', color: 'rgb(122,142,168)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = portal?.color ?? '#e8a214';
                (e.currentTarget as HTMLElement).style.color = portal?.bright ?? '#f5c842';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(122,142,168,0.3)';
                (e.currentTarget as HTMLElement).style.color = 'rgb(122,142,168)';
              }}
            >
              ESC ✕
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="overflow-y-auto flex-1"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${portal?.color ?? '#e8a214'}40 transparent`,
            animation: 'fade-up 0.4s 0.1s ease both',
          }}
        >
          {content}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-2 flex-shrink-0 font-mono text-xs"
          style={{
            borderTop: '1px solid rgba(30,48,85,0.4)',
            color: 'rgba(122,142,168,0.38)',
            animation: 'fade-up 0.4s 0.18s ease both',
          }}
        >
          <span>ESC to return to world map</span>
          <span>{portal?.label}</span>
        </div>
      </div>
    </div>
  );
};

export default SectionPanel;
