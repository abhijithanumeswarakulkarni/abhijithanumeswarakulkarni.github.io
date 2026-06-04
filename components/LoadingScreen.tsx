import React, { useState, useEffect, useRef, useCallback } from 'react';

const STEPS = [
  { label: 'Collecting power-ups',   ms: 360 },
  { label: 'Warming up kart engine', ms: 500 },
  { label: 'Building cube cities',   ms: 620 },
  { label: 'Placing section tokens', ms: 440 },
  { label: 'Charging turbo boost',   ms: 530 },
  { label: 'Loading world map',      ms: 380 },
  { label: 'Ready to race!',         ms: 260 },
];
const TOTAL = STEPS.reduce((s, x) => s + x.ms, 0);

// White → grey family, used left to right on the bar
const BAR_COLORS = ['#FFFFFF','#E6ECF4','#CED6E2','#B2BCCC','#94A0B4','#76849C'];

interface Props { onDone: () => void; }

const LoadingScreen: React.FC<Props> = ({ onDone }) => {
  const canvasRef              = useRef<HTMLCanvasElement>(null);
  const [step,   setStep]      = useState(0);
  const [pct,    setPct]       = useState(0);
  const [coins,  setCoins]     = useState(0);
  const [ready,  setReady]     = useState(false);
  const [fading, setFading]    = useState(false);

  useEffect(() => {
    let elapsed = 0, idx = 0, cancelled = false;
    const iv = window.setInterval(() => {
      if (!cancelled) setCoins(c => c + 3 + Math.floor(Math.random() * 4));
    }, 75);
    const run = () => {
      if (cancelled || idx >= STEPS.length) { if (!cancelled) setReady(true); return; }
      const { ms } = STEPS[idx];
      setTimeout(() => {
        if (cancelled) return;
        elapsed += ms; idx++;
        setStep(idx);
        setPct(Math.min(100, Math.round(elapsed / TOTAL * 100)));
        run();
      }, ms);
    };
    run();
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  const dismiss = useCallback(() => {
    if (!ready || fading) return;
    setFading(true);
    setTimeout(onDone, 500);
  }, [ready, fading, onDone]);

  useEffect(() => {
    if (!ready) return;
    const h = () => dismiss();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [ready, dismiss]);

  // Canvas: stars + floating coins
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.4 + Math.random() * 2.2,
      a: Math.random(), va: (Math.random() - 0.5) * 0.022,
      col: ['#FFFFFF','#E6ECF4','#D8DEE8','#AAB4C4','#8C97AA'][Math.floor(Math.random()*5)],
    }));
    const floaters = Array.from({ length: 18 }, () => ({
      x: Math.random(), y: 1.05 + Math.random() * 0.1,
      life: Math.random(), speed: 0.0007 + Math.random() * 0.0005,
    }));

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    let raf: number;
    const frame = () => {
      const W = canvas.width, H = canvas.height;
      const bg = ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,'#0C0F14'); bg.addColorStop(0.5,'#161B24'); bg.addColorStop(1,'#0C0F14');
      ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

      // Pixel grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
      for (let x=0;x<W;x+=22){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for (let y=0;y<H;y+=22){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

      // Stars
      for (const s of stars) {
        s.a = Math.max(0.05, Math.min(0.9, s.a + s.va));
        if (s.a <= 0.05 || s.a >= 0.9) s.va *= -1;
        ctx.globalAlpha = s.a; ctx.fillStyle = s.col;
        ctx.beginPath(); ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2); ctx.fill();
      }

      // Floating coins
      for (const c of floaters) {
        c.life += c.speed;
        if (c.life > 1) { c.life = 0; c.x = Math.random(); }
        const alpha = Math.sin(c.life * Math.PI) * 0.65;
        const cy = (1 - c.life * 0.22) * H;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = '#D8DEE8'; ctx.shadowBlur = 10;
        ctx.fillStyle = '#D8DEE8';
        ctx.beginPath(); ctx.arc(c.x*W, cy, 9, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#5A6678'; ctx.shadowBlur = 0;
        ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('$', c.x*W, cy);
      }

      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ transition: 'opacity 0.5s ease', opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'auto' }}
      onClick={dismiss}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Scanline */}
      <div className="absolute left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(transparent,rgba(255,255,255,0.05),transparent)', animation: 'scanline 5s linear infinite', top:0 }} />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 w-full" style={{ maxWidth: 680 }}>

        {/* Coin counter */}
        <div className="flex items-center gap-2 self-end">
          <span style={{ fontSize: 20 }}>🪙</span>
          <span className="font-mono font-bold" style={{ color: '#D8DEE8', fontSize: 18, textShadow: '2px 2px 0 #414B5A' }}>
            ×{String(Math.min(coins, 999)).padStart(3,'0')}
          </span>
        </div>

        {/* Title card */}
        <div className="relative w-full text-center p-7"
          style={{ background:'rgba(12,15,20,0.9)', border:'3px solid #D8DEE8', boxShadow:'0 0 0 1px #000, 0 0 40px rgba(255,255,255,0.14), inset 0 0 30px rgba(255,255,255,0.05)' }}>
          {/* Corner stars — gold shades */}
          {[['#FFFFFF','top-[-10px] left-[-10px]'],['#E6ECF4','top-[-10px] right-[-10px]'],['#D8DEE8','bottom-[-10px] left-[-10px]'],['#AAB4C4','bottom-[-10px] right-[-10px]']].map(([col,pos])=>(
            <span key={pos} className={`absolute text-2xl ${pos}`} style={{ color:col as string, filter:`drop-shadow(0 0 8px ${col})` }}>★</span>
          ))}

          <p className="font-mono mb-3" style={{ fontSize:9, color:'rgba(255,255,255,0.55)', letterSpacing:'0.32em' }}>
            ★  WELCOME TO THE WORLD OF  ★
          </p>

          {/* Full name — three shades of gold */}
          {['ABHIJIT','HANUMESWARA','KULKARNI'].map((word, wi) => {
            const colors  = ['#FFFFFF','#E6ECF4','#AAB4C4'];
            const shadows = ['#5A6678','#414B5A','#2E3744'];
            return (
              <div key={wi} className="font-black tracking-wider font-cinzel"
                style={{ fontSize:'clamp(1.5rem,5.5vw,2.8rem)', lineHeight:1.15,
                  color: colors[wi],
                  textShadow: `3px 3px 0 ${shadows[wi]}, 0 0 24px ${colors[wi]}55` }}>
                {word}
              </div>
            );
          })}

          <div className="flex items-center justify-center gap-2 mt-4">
            <span style={{ color:'rgba(255,255,255,0.2)', fontSize:11 }}>───────</span>
            <span className="font-cinzel" style={{ color:'#C0C8D4', fontSize:12, letterSpacing:'0.2em' }}>PORTFOLIO GRAND PRIX</span>
            <span style={{ color:'rgba(255,255,255,0.2)', fontSize:11 }}>───────</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-2">
          <div className="flex justify-between">
            <span className="font-mono text-xs" style={{ color:'rgba(200,208,220,0.55)' }}>LOADING WORLD DATA</span>
            <span className="font-mono text-xs font-bold" style={{ color:'#D8DEE8' }}>{pct}%</span>
          </div>
          <div className="w-full h-5 relative overflow-hidden"
            style={{ background:'rgba(0,0,0,0.55)', border:'2px solid rgba(255,255,255,0.35)' }}>
            <div className="absolute inset-y-0 left-0 transition-all duration-300 flex" style={{ width:`${pct}%` }}>
              {BAR_COLORS.map((c,i)=>(
                <div key={i} style={{ flex:1, background:c, opacity:0.9 }} />
              ))}
              <div className="absolute inset-0" style={{ background:'linear-gradient(transparent 55%,rgba(255,255,255,0.15) 55%)' }} />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="w-full space-y-1.5">
          {STEPS.map((s, i) => {
            const done = i < step, active = i === step;
            return (
              <div key={i} className="flex items-center gap-3 transition-all duration-200"
                style={{ opacity: done || active ? 1 : 0.18 }}>
                <span className="font-mono text-xs w-4 flex-shrink-0"
                  style={{ color: done ? '#D8DEE8' : active ? '#E6ECF4' : 'rgba(255,255,255,0.3)' }}>
                  {done ? '✓' : active ? '▶' : '○'}
                </span>
                <span className="font-mono text-xs flex-1"
                  style={{ color: done ? 'rgba(200,208,220,0.65)' : active ? '#FFFFFF' : 'rgba(200,208,220,0.25)' }}>
                  {s.label}
                </span>
                {done && <span className="font-mono text-xs" style={{ color:'#C0C8D4' }}>+{10+i*5} pts</span>}
                {active && <span className="font-mono text-xs" style={{ color:'#E6ECF4' }}>...</span>}
              </div>
            );
          })}
        </div>

        {/* Press start */}
        <div className="h-9 flex items-center justify-center">
          {ready && (
            <p className="font-cinzel font-bold tracking-[0.22em] anim-blink-soft"
              style={{ color:'#E6ECF4', fontSize:14, textShadow:'2px 2px 0 #414B5A, 0 0 18px #D8DEE888' }}>
              ► PRESS ANY KEY TO START ◄
            </p>
          )}
        </div>
      </div>

      {/* CRT scanlines */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)' }} />
    </div>
  );
};

export default LoadingScreen;
