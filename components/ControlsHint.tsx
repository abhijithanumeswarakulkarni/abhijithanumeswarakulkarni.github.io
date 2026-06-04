import React from 'react';

const Key: React.FC<{ label: string; wide?: boolean }> = ({ label, wide }) => (
  <span
    className="inline-flex items-center justify-center font-mono text-xs select-none"
    style={{
      minWidth:   wide ? 40 : 22,
      height:     20,
      padding:    '0 4px',
      border:     '1px solid rgba(255,220,0,0.4)',
      background: 'rgba(255,220,0,0.09)',
      color:      'rgba(255,240,180,0.85)',
      fontSize:   10,
    }}
  >
    {label}
  </span>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-1">{children}</div>
);

const ControlsHint: React.FC = () => (
  <div
    className="fixed bottom-4 left-4 z-20 pointer-events-none"
    style={{
      background: 'rgba(8,12,20,0.78)',
      border: '1px solid rgba(255,220,0,0.22)',
      padding: '10px 12px',
    }}
  >
    <div className="absolute top-0 left-0 w-3 h-3"
      style={{ borderTop: '1.5px solid rgba(255,220,0,0.6)', borderLeft: '1.5px solid rgba(255,220,0,0.6)' }} />
    <div className="absolute bottom-0 right-0 w-3 h-3"
      style={{ borderBottom: '1.5px solid rgba(255,220,0,0.6)', borderRight: '1.5px solid rgba(255,220,0,0.6)' }} />

    <p className="font-mono mb-2.5" style={{ fontSize: 9, color: 'rgba(255,220,0,0.55)', letterSpacing: '0.2em' }}>
      CONTROLS
    </p>

    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-0.5">
          <Row><Key label="W" /></Row>
          <Row><Key label="A" /><Key label="S" /><Key label="D" /></Row>
        </div>
        <span className="font-mono" style={{ fontSize: 9, color: 'rgba(180,180,180,0.45)' }}>/</span>
        <div className="flex flex-col items-center gap-0.5">
          <Row><Key label="↑" /></Row>
          <Row><Key label="←" /><Key label="↓" /><Key label="→" /></Row>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 pt-1.5" style={{ borderTop: '1px solid rgba(30,48,85,0.5)' }}>
        <div className="flex items-center gap-1.5">
          <Key label="W" /><Key label="↑" />
          <span className="font-mono" style={{ fontSize: 9, color: 'rgba(122,142,168,0.6)' }}>Accelerate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Key label="S" /><Key label="↓" />
          <span className="font-mono" style={{ fontSize: 9, color: 'rgba(122,142,168,0.6)' }}>Brake</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Key label="A" /><Key label="D" />
          <span className="font-mono" style={{ fontSize: 9, color: 'rgba(122,142,168,0.6)' }}>Steer</span>
        </div>
      </div>
    </div>
  </div>
);

export default ControlsHint;
