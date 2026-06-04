import React, { useState } from 'react';
import { THEMES, SEASON_ORDER, type Season } from './themes';

interface Props {
  current: Season;
  onChange: (s: Season) => void;
}

const PANEL = 'rgba(10,13,18,0.96)';   // near-opaque dark, reads on any season bg

const ThemeToggle: React.FC<Props> = ({ current, onChange }) => {
  const [open, setOpen] = useState(false);
  const cur = THEMES[current];

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col items-end gap-2 select-none">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 px-3.5 py-2.5"
        style={{
          background: PANEL,
          border: `2px solid ${cur.accent}`,
          color: '#fff',
          boxShadow: `0 2px 10px rgba(0,0,0,0.5), 0 0 14px ${cur.accent}33`,
        }}
      >
        <span style={{ fontSize: 17, lineHeight: 1 }}>{cur.icon}</span>
        <span className="font-cinzel text-xs font-bold tracking-widest" style={{ color: '#fff' }}>
          {cur.season}
        </span>
        <span className="font-mono text-[10px]" style={{ color: cur.accent }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Season options */}
      {open && (
        <div className="flex flex-col gap-1.5" style={{ animation: 'fade-up 0.18s ease both' }}>
          {SEASON_ORDER.map(s => {
            const t = THEMES[s];
            const active = s === current;
            return (
              <button
                key={s}
                onClick={() => { setOpen(false); if (!active) onChange(s); }}
                className="flex items-center gap-3 px-3.5 py-2.5"
                style={{
                  minWidth: 190,
                  background: PANEL,
                  border: `2px solid ${active ? t.accent : 'rgba(255,255,255,0.14)'}`,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.accent; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = active ? t.accent : 'rgba(255,255,255,0.14)'; }}
              >
                {/* Accent swatch + icon */}
                <span className="flex items-center justify-center"
                  style={{ width: 26, height: 26, background: `${t.accent}22`, border: `1.5px solid ${t.accent}`, fontSize: 15 }}>
                  {t.icon}
                </span>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-cinzel text-xs font-bold tracking-wider" style={{ color: '#fff' }}>{t.season}</span>
                  <span className="font-mono text-[9px]" style={{ color: t.accent }}>{t.world}</span>
                </div>
                {active && <span className="ml-auto font-mono text-[10px]" style={{ color: t.accent }}>● ACTIVE</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
