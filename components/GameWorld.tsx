import React, { useRef, useEffect, useCallback } from 'react';
import { PORTALS } from './gameData';
import type { Theme } from './themes';
export { PORTALS } from './gameData';

// ── Isometric constants ────────────────────────────────────────────────────
const TW    = 80;  // tile width (screen px)
const TH    = 40;  // tile height (screen px)
const CZ    = 36;  // cube height per world-unit (screen px)
const CS    = 0.88;  // voxel world size
const WORLD = 60;
const BORDER = 2.0;   // world boundary margin
const HIT_R  = 2.2;

/*
 * Voxel monuments — each section is a recognisable little sculpture built from
 * cubes, defined as layers bottom→top. Each layer is `foot` rows of `foot`
 * chars. Material legend:
 *   '.' empty   'W' white body   'D' dark base   'A' accent   'G' glowing window
 */
interface Monument { foot: number; accent: string; layers: string[][]; }

const MONUMENTS: Record<string, Monument> = {
  // Pedestal monument crowned with a floating orb
  about: { foot: 5, accent: '#B9A8FF', layers: [
    ['DDDDD', 'DDDDD', 'DDDDD', 'DDDDD', 'DDDDD'],
    ['.....', '.WWW.', '.WGW.', '.WWW.', '.....'],
    ['.....', '..W..', '.WWW.', '..W..', '.....'],
    ['.....', '..W..', '..W..', '..W..', '.....'],
    ['.....', '.....', '..A..', '.....', '.....'],
  ]},
  // Graduation cap (mortarboard) on an academy block
  education: { foot: 5, accent: '#8FB6FF', layers: [
    ['.....', '.WWW.', '.WGW.', '.WWW.', '.....'],
    ['.....', '.WGW.', '.WWW.', '.WGW.', '.....'],
    ['.....', '..W..', '..W..', '..W..', '.....'],
    ['AAAAA', 'AAAAA', 'AAAAA', 'AAAAA', 'AAAAA'],
    ['.....', '.....', '..A..', '.....', '.....'],
  ]},
  // Corporate skyscraper, lots of windows, antenna crown
  experience: { foot: 3, accent: '#9FB4CC', layers: [
    ['WWW', 'WGW', 'WWW'],
    ['WGW', 'WWW', 'WGW'],
    ['WWW', 'WGW', 'WWW'],
    ['WGW', 'WWW', 'WGW'],
    ['WWW', 'WGW', 'WWW'],
    ['.A.', 'A.A', '.A.'],
  ]},
  // Rocket with fins, porthole and nose cone (flame added in-engine)
  projects: { foot: 3, accent: '#FF7A5C', layers: [
    ['A.A', '.W.', 'A.A'],
    ['.W.', 'WWW', '.W.'],
    ['.W.', 'WGW', '.W.'],
    ['.W.', '.W.', '.W.'],
    ['...', '.W.', '...'],
    ['...', '.A.', '...'],
  ]},
  // Crystal spire / power gem
  skills: { foot: 5, accent: '#5FE0C0', layers: [
    ['.....', '..D..', '.DWD.', '..D..', '.....'],
    ['.....', '.WAW.', 'WAAAW', '.WAW.', '.....'],
    ['.....', '..A..', '.AAA.', '..A..', '.....'],
    ['.....', '.....', '..A..', '.....', '.....'],
    ['.....', '.....', '..A..', '.....', '.....'],
  ]},
  // Signal / antenna tower with a glowing beacon (pulse rings added in-engine)
  contact: { foot: 3, accent: '#5FD0FF', layers: [
    ['WWW', 'WGW', 'WWW'],
    ['W.W', '...', 'W.W'],
    ['.W.', 'WWW', '.W.'],
    ['...', '.W.', '...'],
    ['...', '.A.', '...'],
  ]},
};
const DEFAULT_MONUMENT: Monument = { foot: 3, accent: '#C8D0DC', layers: [
  ['WWW', 'WGW', 'WWW'], ['WGW', 'WWW', 'WGW'], ['WWW', 'WGW', 'WWW'],
]};

interface Voxel { gx: number; gy: number; gz: number; mat: string; }
function parseMonument(m: Monument): { cells: Voxel[]; maxH: number } {
  const cells: Voxel[] = [];
  m.layers.forEach((layer, gz) => {
    layer.forEach((row, gy) => {
      for (let gx = 0; gx < row.length; gx++) {
        const ch = row[gx];
        if (ch !== '.' && ch !== ' ') cells.push({ gx, gy, gz, mat: ch });
      }
    });
  });
  // Painter order for iso voxels: low layer first, back-to-front within a layer
  cells.sort((a, b) => a.gz - b.gz || (a.gx + a.gy) - (b.gx + b.gy));
  return { cells, maxH: m.layers.length };
}

function iso(wx: number, wy: number, wz = 0): [number, number] {
  return [(wx - wy) * TW / 2, (wx + wy) * TH / 2 - wz * CZ];
}
function shd(hex: string, f: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgb(${Math.min(255, ((n >> 16) & 255) * f | 0)},${Math.min(255, ((n >> 8) & 255) * f | 0)},${Math.min(255, (n & 255) * f | 0)})`;
}

// Coin-gold palette for UI (3 shades of one colour)
const G1 = '#FFFFFF'; // bright (white)
const G2 = '#C8D0DC'; // mid (light grey)
const G3 = '#6C7686'; // dark (slate grey)
const GB = 'rgba(10,14,20,0.82)'; // panel background (neutral dark)

interface Tower {
  id: string; label: string; bright: string; accent: string;
  cx: number; cy: number;
  cols: [string, string, string];      // white body faces
  darkCols: [string, string, string];  // dark base faces
  accCols: [string, string, string];   // accent faces
  state: 'standing' | 'fallen';
  foot: number; cells: Voxel[]; maxH: number;
}
interface FlyingCube { wx: number; wy: number; wz: number; vx: number; vy: number; vz: number; rot: number; rotV: number; alpha: number; cols: [string, string, string]; }
interface Particle { wx: number; wy: number; wz: number; vx: number; vy: number; vz: number; col: string; sz: number; alpha: number; rot: number; rotV: number; type: 'star' | 'coin'; }
interface Prop { wx: number; wy: number; type: 'rock' | 'bush' | 'flower'; r: number; dark: boolean; }

interface Props { onEnter: (id: string) => void; respawnAt: string | null; onRespawned: () => void; theme: Theme; }

const GameWorld: React.FC<Props> = ({ onEnter, respawnAt, onRespawned, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enterRef  = useRef(onEnter);
  const respRef   = useRef(onRespawned);
  const themeRef  = useRef(theme);
  const pendResp  = useRef<string | null>(null);
  useEffect(() => { enterRef.current = onEnter; }, [onEnter]);
  useEffect(() => { respRef.current  = onRespawned; }, [onRespawned]);
  useEffect(() => { themeRef.current = theme; }, [theme]);   // live palette swap (no rebuild)
  useEffect(() => { if (!respawnAt) return; pendResp.current = respawnAt; respRef.current(); }, [respawnAt]);

  const keys = useRef(new Set<string>());
  const onKD = useCallback((e: KeyboardEvent) => {
    keys.current.add(e.key.toLowerCase());
    if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) e.preventDefault();
  }, []);
  const onKU = useCallback((e: KeyboardEvent) => { keys.current.delete(e.key.toLowerCase()); }, []);
  useEffect(() => {
    window.addEventListener('keydown', onKD); window.addEventListener('keyup', onKU);
    return () => { window.removeEventListener('keydown', onKD); window.removeEventListener('keyup', onKU); };
  }, [onKD, onKU]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    // Live palette — reassigned each frame from themeRef so season changes apply
    // instantly without tearing down / rebuilding the (small) world.
    let PAL = themeRef.current;
    let curThemeId = PAL.id;

    let carX = 30, carY = 46, carAng = 0, carSpd = 0;
    let carVX = 0, carVY = 0;                 // world-space velocity (separate from heading)
    let driftActive = false;                  // true while sliding (drives HUD indicator)
    let lastTrailX = carX, lastTrailY = carY; // throttles tyre-trail spawning by distance
    const skids: { wx: number; wy: number; a: number; w: number }[] = []; // tyre tracks + drift skids
    const dust:  { wx: number; wy: number; wz: number; vx: number; vy: number; vz: number; a: number; sz: number }[] = [];
    const smoke: { wx: number; wy: number; wz: number; vx: number; vy: number; vz: number; a: number; sz: number }[] = []; // exhaust
    let towers: Tower[] = [], flying: FlyingCube[] = [], particles: Particle[] = [];
    let trees: { wx: number; wy: number; r: number; dark: boolean }[] = [];
    let props: Prop[] = [];
    const triggered = new Set<string>();
    let shake = 0, flash = 0;
    // Ambient weather (screen-space): falling leaves / snow / sand wisps
    const weather: { x: number; y: number; vx: number; vy: number; rot: number; rotV: number; sz: number; sway: number }[] = [];

    function buildWorld() {
      towers = PORTALS.map(p => {
        const mon = MONUMENTS[p.id] ?? DEFAULT_MONUMENT;
        const { cells, maxH } = parseMonument(mon);
        return {
          id: p.id, label: p.label, bright: p.bright, accent: mon.accent,
          cx: p.fx * WORLD, cy: p.fy * WORLD,
          cols:     [shd(p.bright, 1.0),  shd(p.color, 0.88), shd(p.color, 0.60)] as [string, string, string],
          darkCols: [shd(p.color, 0.66),  shd(p.color, 0.52), shd(p.color, 0.38)] as [string, string, string],
          accCols:  [shd(mon.accent, 1.0), shd(mon.accent, 0.82), shd(mon.accent, 0.58)] as [string, string, string],
          state: 'standing' as const,
          foot: mon.foot, cells, maxH,
        };
      });
      trees = []; props = [];
      const rng = () => BORDER + Math.random() * (WORLD - BORDER * 2);
      const clearOfTowers = (wx: number, wy: number, r: number) =>
        towers.every(t => Math.hypot(wx - t.cx, wy - t.cy) > r);

      for (let i = 0; i < 70; i++) {
        const wx = rng(), wy = rng();
        if (clearOfTowers(wx, wy, 5)) trees.push({ wx, wy, r: 0.55 + Math.random() * 0.8, dark: Math.random() > 0.5 });
      }
      for (let i = 0; i < 40; i++) {
        const wx = rng(), wy = rng();
        const t = (['rock', 'rock', 'bush', 'flower'] as const)[Math.floor(Math.random() * 4)];
        if (clearOfTowers(wx, wy, 4) && trees.every(tr => Math.hypot(wx - tr.wx, wy - tr.wy) > 1.5))
          props.push({ wx, wy, type: t, r: 0.3 + Math.random() * 0.5, dark: Math.random() > 0.5 });
      }
    }
    buildWorld();
    const about = towers.find(t => t.id === 'about');
    if (about) { carX = about.cx; carY = about.cy + 3.5; }

    function initWeather() {
      weather.length = 0;
      const count = PAL.ambient === 'snow' ? 90 : PAL.ambient === 'leaves' ? 55 : 40;
      for (let i = 0; i < count; i++) {
        weather.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: PAL.ambient === 'sand' ? 1.4 + Math.random() * 1.6 : (Math.random() - 0.5) * 0.7,
          vy: PAL.ambient === 'snow' ? 0.5 + Math.random() * 0.9 : 0.8 + Math.random() * 1.4,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.08,
          sz: PAL.ambient === 'snow' ? 1.5 + Math.random() * 2.5 : 3 + Math.random() * 3,
          sway: Math.random() * Math.PI * 2,
        });
      }
    }

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initWeather(); }
    resize(); window.addEventListener('resize', resize);

    // ── Ambient weather (screen-space, drawn on top) ──
    function drawWeather(time: number) {
      const W = canvas.width, H = canvas.height;
      const leafCols = ['#E0742E', '#C9482E', '#E0A52A', '#B8841C'];
      for (const p of weather) {
        p.sway += 0.04;
        p.x += p.vx + (PAL.ambient !== 'sand' ? Math.sin(p.sway) * 0.6 : 0);
        p.y += p.vy; p.rot += p.rotV;
        if (p.y > H + 8) { p.y = -8; p.x = Math.random() * W; }
        if (p.x > W + 8) { p.x = -8; } if (p.x < -8) { p.x = W + 8; }
        if (PAL.ambient === 'snow') {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill();
        } else if (PAL.ambient === 'leaves') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillStyle = leafCols[Math.floor(p.sway) % leafCols.length];
          ctx.beginPath(); ctx.ellipse(0, 0, p.sz, p.sz * 0.5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        } else { // sand wisps
          ctx.fillStyle = `rgba(220,196,140,0.35)`;
          ctx.beginPath(); ctx.ellipse(p.x, p.y, p.sz * 1.6, p.sz * 0.4, 0, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // Screen projection helpers
    function sp(wx: number, wy: number, wz: number, cx: number, cy: number): [number, number] {
      const [ix, iy] = iso(wx, wy, wz);
      return [ix - cx + canvas.width / 2, iy - cy + canvas.height / 2];
    }

    // ── Ground tile ────────────────────────────────────────────────────────
    function drawTile(gx: number, gy: number, camX: number, camY: number) {
      const W = canvas.width, H = canvas.height;
      const pts = [[gx,gy],[gx+1,gy],[gx+1,gy+1],[gx,gy+1]].map(([x,y]) => sp(x, y, 0, camX, camY));
      if (pts.every(([px, py]) => px < -5 || px > W + 5 || py < -5 || py > H + 5)) return;
      // Sand tiles — subtle checkerboard of two tan shades, edges deeper
      const onEdge = gx < 2 || gy < 2 || gx >= WORLD - 2 || gy >= WORLD - 2;
      ctx.fillStyle = onEdge ? PAL.tileEdge : ((gx + gy) % 2 === 0 ? PAL.tileA : PAL.tileB);
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < 4; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(120,90,40,0.07)'; ctx.lineWidth = 0.5; ctx.stroke();
    }

    // ── Isometric cube (3 faces) ───────────────────────────────────────────
    function drawCube(
      wx: number, wy: number, wz: number, s: number,
      camX: number, camY: number,
      [tc, rc, lc]: [string, string, string],
      alpha: number
    ) {
      const p = (x: number, y: number, z: number) => sp(x, y, z, camX, camY);
      const BBT = p(wx, wy, wz+s), FBT = p(wx+s, wy, wz+s), FFT = p(wx+s, wy+s, wz+s), BFT = p(wx, wy+s, wz+s);
      const FBB = p(wx+s, wy, wz), FFB = p(wx+s, wy+s, wz), BFB = p(wx, wy+s, wz);
      ctx.globalAlpha = alpha;
      // Top
      ctx.fillStyle = tc; ctx.beginPath();
      ctx.moveTo(BBT[0],BBT[1]); ctx.lineTo(FBT[0],FBT[1]); ctx.lineTo(FFT[0],FFT[1]); ctx.lineTo(BFT[0],BFT[1]);
      ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 0.6; ctx.stroke();
      // Right
      ctx.fillStyle = rc; ctx.beginPath();
      ctx.moveTo(FBB[0],FBB[1]); ctx.lineTo(FBT[0],FBT[1]); ctx.lineTo(FFT[0],FFT[1]); ctx.lineTo(FFB[0],FFB[1]);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Left
      ctx.fillStyle = lc; ctx.beginPath();
      ctx.moveTo(BFB[0],BFB[1]); ctx.lineTo(BFT[0],BFT[1]); ctx.lineTo(FFT[0],FFT[1]); ctx.lineTo(FFB[0],FFB[1]);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // ── Voxel monument (per-section sculpture) + accent light beam ───────────
    function drawTower(t: Tower, camX: number, camY: number, time: number) {
      const [sx, sy] = sp(t.cx, t.cy, 0, camX, camY);
      // Soft ground shadow sized to footprint
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.beginPath(); ctx.ellipse(sx + 6, sy + 8, t.foot * TW / 2 * CS * 0.46, t.foot * TH / 4 * CS, 0, 0, Math.PI * 2); ctx.fill();

      // Accent light beam rising from the apex (drawn first; voxels overlay its base)
      const [bxT, byT] = sp(t.cx, t.cy, (t.maxH + 6) * CS, camX, camY);
      const [, byB]    = sp(t.cx, t.cy, t.maxH * CS, camX, camY);
      const beam = ctx.createLinearGradient(0, byT, 0, byB);
      beam.addColorStop(0, 'transparent');
      beam.addColorStop(1, t.accent + '44');
      ctx.fillStyle = beam;
      const bw = 6 + Math.sin(time * 0.004 + t.cx) * 1.5;
      ctx.fillRect(bxT - bw, byT, bw * 2, byB - byT);

      const ox = t.cx - t.foot * CS / 2, oy = t.cy - t.foot * CS / 2;

      // Voxels (pre-sorted back-to-front, bottom-to-top)
      for (const v of t.cells) {
        const cols = v.mat === 'A' ? t.accCols : v.mat === 'D' ? t.darkCols : t.cols;
        drawCube(ox + v.gx * CS, oy + v.gy * CS, v.gz * CS, CS, camX, camY, cols, 1);
        if (v.mat === 'G') {
          // Glowing window on the camera-facing face
          const [wxs, wys] = sp(ox + v.gx * CS + CS * 1.02, oy + v.gy * CS + CS * 0.5, v.gz * CS + CS * 0.55, camX, camY);
          ctx.fillStyle = '#FFFEF6'; ctx.shadowColor = '#FFFFFF'; ctx.shadowBlur = 6;
          ctx.fillRect(wxs - 2.5, wys - 3.5, 5, 7); ctx.shadowBlur = 0;
        }
      }

      // Pulsing apex orb + rising sparkles
      const [ax, ay] = sp(t.cx, t.cy, (t.maxH + 0.6) * CS, camX, camY);
      const pulse = 0.6 + Math.sin(time * 0.005 + t.cx) * 0.4;
      ctx.fillStyle = t.accent; ctx.shadowColor = t.accent; ctx.shadowBlur = 14 * pulse;
      ctx.beginPath(); ctx.arc(ax, ay, 3, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      for (let i = 0; i < 3; i++) {
        const ph = (time * 0.0006 + i * 0.34 + t.cx * 0.1) % 1;
        const psy = ay - ph * 42;
        ctx.globalAlpha = (1 - ph) * 0.8;
        ctx.fillStyle = t.accent;
        ctx.beginPath(); ctx.arc(ax + Math.sin(ph * 6 + i) * 6, psy, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // ── Floating banner title above a tower (bobs up & down) ─────────────────
    function drawFloatingTitle(t: Tower, camX: number, camY: number, time: number) {
      const bob = Math.sin(time * 0.0022 + t.cx * 0.3) * 6;
      const [ax, ayRaw] = sp(t.cx, t.cy, t.maxH * CS + 1.4, camX, camY);
      const ay = ayRaw + bob;

      ctx.font = `bold 13px 'Cinzel',serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tw = ctx.measureText(t.label).width;
      const padX = 14, padY = 8;
      const bw = tw + padX * 2, bh = 26;
      const bx = ax - bw / 2, by = ay - bh / 2;

      // Glow halo
      ctx.shadowColor = t.bright; ctx.shadowBlur = 16;
      // Panel background
      ctx.fillStyle = 'rgba(12,16,22,0.92)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 5); else ctx.rect(bx, by, bw, bh);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Gold border
      ctx.strokeStyle = t.bright; ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 5); else ctx.rect(bx, by, bw, bh);
      ctx.stroke();

      // Corner studs
      ctx.fillStyle = t.bright;
      [[bx + 4, by + 4], [bx + bw - 4, by + 4], [bx + 4, by + bh - 4], [bx + bw - 4, by + bh - 4]]
        .forEach(([sx, sy]) => { ctx.fillRect(sx - 1.5, sy - 1.5, 3, 3); });

      // Downward pointer triangle
      ctx.fillStyle = 'rgba(12,16,22,0.92)';
      ctx.strokeStyle = t.bright; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ax - 6, by + bh - 1);
      ctx.lineTo(ax + 6, by + bh - 1);
      ctx.lineTo(ax, by + bh + 7);
      ctx.closePath(); ctx.fill();
      // re-stroke only the two angled sides so the top edge stays open
      ctx.beginPath();
      ctx.moveTo(ax - 6, by + bh - 1); ctx.lineTo(ax, by + bh + 7);
      ctx.moveTo(ax + 6, by + bh - 1); ctx.lineTo(ax, by + bh + 7);
      ctx.stroke();

      // Label text
      ctx.fillStyle = t.bright;
      ctx.shadowColor = t.bright; ctx.shadowBlur = 6;
      ctx.fillText(t.label, ax, ay + 1);
      ctx.shadowBlur = 0;
    }

    const rrect = (x: number, y: number, w: number, h: number) => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, Math.abs(w) / 2); else ctx.rect(x, y, w, h);
      ctx.fill();
    };

    // ── Tree (season-dependent: cactus / leafy / pine) ───────────────────────
    function drawTree(wx: number, wy: number, r: number, dark: boolean, camX: number, camY: number) {
      const [bx, by] = sp(wx, wy, 0, camX, camY);
      // Ground shadow
      ctx.fillStyle = PAL.id === 'desert' ? 'rgba(90,60,20,0.18)' : PAL.id === 'ice' ? 'rgba(80,110,130,0.16)' : 'rgba(30,60,20,0.18)';
      ctx.beginPath(); ctx.ellipse(bx + r * 6, by + 3, r * TW * 0.3, r * TH * 0.22, 0, 0, Math.PI * 2); ctx.fill();

      if (PAL.id === 'desert') {
        // Saguaro cactus
        const body = dark ? '#3f6b32' : '#4e8a3c', lite = dark ? '#4e7d3e' : '#62a64c';
        const stemW = Math.max(5, r * 9), stemH = r * CZ * 1.5;
        ctx.fillStyle = body; rrect(bx - stemW / 2, by - stemH, stemW, stemH);
        rrect(bx - stemW * 1.5, by - stemH * 0.78, stemW * 0.7, stemH * 0.42);
        rrect(bx - stemW * 1.5, by - stemH * 0.78, stemW * 0.6, -stemH * 0.34);
        rrect(bx + stemW * 0.8, by - stemH * 0.62, stemW * 0.7, stemH * 0.36);
        rrect(bx + stemW * 1.35, by - stemH * 0.85, stemW * 0.6, stemH * 0.34);
        ctx.fillStyle = lite; rrect(bx - stemW / 2 + 1, by - stemH, stemW * 0.32, stemH);
        ctx.beginPath(); ctx.arc(bx, by - stemH, stemW / 2, Math.PI, 0); ctx.fill();
      } else if (PAL.id === 'ice') {
        // Snow-covered pine
        const trunkH = r * CZ * 0.5;
        ctx.fillStyle = '#6b4a24'; ctx.fillRect(bx - 2, by - trunkH, 4, trunkH);
        const tiers = 3, th = r * CZ * 0.62;
        for (let i = 0; i < tiers; i++) {
          const yTop = by - trunkH - th * (i + 1) * 0.8;
          const wBase = r * TW * (0.42 - i * 0.1);
          ctx.fillStyle = dark ? '#2c6042' : '#347a4e';
          ctx.beginPath(); ctx.moveTo(bx, yTop); ctx.lineTo(bx - wBase, yTop + th); ctx.lineTo(bx + wBase, yTop + th); ctx.closePath(); ctx.fill();
          // snow cap
          ctx.fillStyle = '#f4fbff';
          ctx.beginPath(); ctx.moveTo(bx, yTop); ctx.lineTo(bx - wBase * 0.5, yTop + th * 0.5); ctx.lineTo(bx + wBase * 0.5, yTop + th * 0.5); ctx.closePath(); ctx.fill();
        }
      } else {
        // Leafy tree with blossoms (spring/fall)
        const trunkH = r * CZ * 0.7;
        ctx.fillStyle = '#7B4F1E'; ctx.fillRect(bx - 2.5, by - trunkH, 5, trunkH);
        const [tx, ty] = sp(wx, wy, r * 0.8, camX, camY);
        const leaf = dark ? '#2f7a36' : '#3fa048', leafLite = dark ? '#3c9444' : '#54c25c';
        ctx.fillStyle = leaf; ctx.shadowColor = 'rgba(20,60,20,0.3)'; ctx.shadowBlur = 4;
        ctx.beginPath(); ctx.ellipse(tx, ty, r * TW / 2 * 0.6, r * TH * 0.62, 0, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = leafLite;
        ctx.beginPath(); ctx.ellipse(tx - r * TW * 0.08, ty - r * TH * 0.2, r * TW / 2 * 0.38, r * TH * 0.38, 0, 0, Math.PI * 2); ctx.fill();
        // Blossom / berry dots
        const petals = ['#ffd1e0', '#ffe08a', '#ff9ab0'];
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2 + wx, rr2 = r * TW * 0.2;
          ctx.fillStyle = petals[(i + (dark ? 1 : 0)) % petals.length];
          ctx.beginPath(); ctx.arc(tx + Math.cos(a) * rr2, ty + Math.sin(a) * rr2 * 0.6, 2.2, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // ── Scenery props (season-dependent rock / bush / flower) ────────────────
    function drawProp(prop: Prop, camX: number, camY: number) {
      const { wx, wy, type, r, dark } = prop;
      if (type === 'rock') {
        const gc: [string, string, string] =
          PAL.id === 'desert' ? ['#C2A268', '#A98750', '#8A6C3C'] :
          PAL.id === 'ice'    ? ['#E2F1F8', '#BcDcEA', '#94B8CC'] :
                                ['#9aa092', '#7c8274', '#5e6456'];
        drawCube(wx - r / 2, wy - r / 2, 0, r * 0.9, camX, camY, gc, 1);
        if (r > 0.5) drawCube(wx - r / 4, wy - r * 0.7, r * 0.6, r * 0.55, camX, camY, gc, 1);
      } else if (type === 'bush') {
        const [bx, by] = sp(wx, wy, 0, camX, camY);
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.beginPath(); ctx.ellipse(bx + 3, by + 3, r * TW * 0.24, r * TH * 0.18, 0, 0, Math.PI * 2); ctx.fill();
        const [tx, ty] = sp(wx, wy, r * 0.4, camX, camY);
        if (PAL.id === 'ice') {
          // Snow mound
          ctx.fillStyle = '#eef8fc'; ctx.beginPath(); ctx.ellipse(tx, ty, r * TW / 2 * 0.55, r * TH * 0.5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(tx - 2, ty - r * TH * 0.16, r * TW / 2 * 0.32, r * TH * 0.3, 0, 0, Math.PI * 2); ctx.fill();
        } else if (PAL.id === 'desert') {
          // Dry shrub
          ctx.fillStyle = dark ? '#9c7434' : '#b08a44';
          ctx.beginPath(); ctx.ellipse(tx, ty, r * TW / 2 * 0.48, r * TH * 0.46, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = dark ? '#7a5a28' : '#8f6e34'; ctx.lineWidth = 1;
          for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(a) * r * TW * 0.26, ty + Math.sin(a) * r * TH * 0.26); ctx.stroke(); }
        } else {
          // Leafy green bush with berries
          ctx.fillStyle = dark ? '#2f7a36' : '#3fa048';
          ctx.beginPath(); ctx.ellipse(tx, ty, r * TW / 2 * 0.5, r * TH * 0.5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = dark ? '#3c9444' : '#54c25c';
          ctx.beginPath(); ctx.ellipse(tx - 2, ty - r * TH * 0.15, r * TW / 2 * 0.3, r * TH * 0.3, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#e05a5a';
          for (let i = 0; i < 3; i++) { const a = i * 2 + wx; ctx.beginPath(); ctx.arc(tx + Math.cos(a) * r * TW * 0.18, ty + Math.sin(a) * r * TH * 0.18, 1.6, 0, Math.PI * 2); ctx.fill(); }
        }
      } else { // flower patch
        const [px, py] = sp(wx, wy, 0.02, camX, camY);
        const moundCol = PAL.id === 'ice' ? 'rgba(220,240,250,0.5)' : PAL.id === 'desert' ? 'rgba(190,150,80,0.45)' : 'rgba(60,140,60,0.4)';
        ctx.fillStyle = moundCol;
        ctx.beginPath(); ctx.ellipse(px, py, r * TW * 0.5, r * TH * 0.5, 0, 0, Math.PI * 2); ctx.fill();
        const blossoms = [[-0.25, -0.1], [0.2, -0.18], [0, 0.12], [0.28, 0.1]];
        // Ice → crystals (blue); desert → gold; forest → mixed petals
        const petalCol = PAL.id === 'ice' ? '#bfe8f7' : PAL.id === 'desert' ? '#F5C518' : null;
        const forestPetals = ['#ff9ab0', '#ffe08a', '#d98aff'];
        for (let i = 0; i < blossoms.length; i++) {
          const [ox, oy] = blossoms[i];
          const bxp = px + ox * r * TW, byp = py + oy * r * TH;
          const col = petalCol ?? forestPetals[i % forestPetals.length];
          ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 4;
          ctx.beginPath(); ctx.arc(bxp, byp, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = PAL.id === 'ice' ? '#ffffff' : '#7A5C00'; ctx.shadowBlur = 0;
          ctx.beginPath(); ctx.arc(bxp, byp, 1, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // ── Boundary wall ──────────────────────────────────────────────────────
    function drawBoundaryWalls(camX: number, camY: number) {
      const wc = PAL.wall;
      const rq: { d: number; fn: () => void }[] = [];
      // Draw wall cubes around the perimeter
      for (let i = 0; i <= WORLD; i += 2) {
        rq.push({ d: i, fn: () => { drawCube(i, 0, 0, 1.5, camX, camY, wc, 1); drawCube(i, 0, 1.5, 1, camX, camY, wc, 1); } });
        rq.push({ d: WORLD + i, fn: () => { drawCube(i, WORLD - 1, 0, 1.5, camX, camY, wc, 1); drawCube(i, WORLD - 1, 1.5, 1, camX, camY, wc, 1); } });
        rq.push({ d: i - i, fn: () => { drawCube(0, i, 0, 1.5, camX, camY, wc, 1); drawCube(0, i, 1.5, 1, camX, camY, wc, 1); } });
        rq.push({ d: WORLD - i, fn: () => { drawCube(WORLD - 1, i, 0, 1.5, camX, camY, wc, 1); drawCube(WORLD - 1, i, 1.5, 1, camX, camY, wc, 1); } });
      }
      rq.sort((a, b) => a.d - b.d);
      rq.forEach(r => r.fn());
    }

    // ── Isometric car (direction-aware, proper wheels) ─────────────────────
    function drawCar(camX: number, camY: number) {
      const halfW = 0.24, halfL = 0.46;    // car footprint
      const wheelZ = 0.10;                  // axle height (chassis floats above ground)
      const bodyH = 0.30, cabZ0 = 0.30, cabH = 0.50;
      const cos = Math.cos(carAng), sin = Math.sin(carAng);
      const fwX = sin, fwY = -cos;          // forward unit
      const rgX = cos, rgY = sin;           // right unit

      const C = (lr: number, lf: number, lz: number): [number, number] =>
        sp(carX + rgX * lr + fwX * lf, carY + rgY * lr + fwY * lf, lz, camX, camY);

      const rightVis = cos - sin > 0;       // right side faces camera
      const frontVis = sin + cos > 0;       // front faces camera

      const quad = (pts: [number, number][], fill: string, stroke = 'rgba(0,0,0,0.32)') => {
        ctx.fillStyle = fill; ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.closePath(); ctx.fill();
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.8; ctx.stroke(); }
      };

      // Ground shadow (soft, offset toward sun)
      const [csx, csy] = sp(carX, carY, 0, camX, camY);
      ctx.fillStyle = 'rgba(90,60,20,0.28)';
      ctx.beginPath(); ctx.ellipse(csx + 6, csy + 7, halfL * TW * 0.6, halfL * TH * 0.55, 0, 0, Math.PI * 2); ctx.fill();

      // ── Wheel renderer: a chunky tyre with rim + hubcap ──
      const drawWheel = (clr: number, clf: number) => {
        const hw = 0.05, hl = 0.12, wz = 0.18;   // half-width, half-length, height
        const b = (lr: number, lf: number, lz: number) => C(clr + lr, clf + lf, lz);
        const TR0 = b(hw, hl, 0), TL0 = b(-hw, hl, 0), BL0 = b(-hw, -hl, 0), BR0 = b(hw, -hl, 0);
        const TR1 = b(hw, hl, wz), TL1 = b(-hw, hl, wz), BL1 = b(-hw, -hl, wz), BR1 = b(hw, -hl, wz);
        // tyre sides (black, only camera-facing ones)
        if (frontVis) quad([TR1, TL1, TL0, TR0], '#0c0c0c', 'rgba(0,0,0,0.4)');
        else          quad([BL1, BR1, BR0, BL0], '#0c0c0c', 'rgba(0,0,0,0.4)');
        if (rightVis) quad([TR1, BR1, BR0, TR0], '#141414', 'rgba(0,0,0,0.4)');
        else          quad([TL1, BL1, BL0, TL0], '#141414', 'rgba(0,0,0,0.4)');
        // tyre top
        quad([TR1, TL1, BL1, BR1], '#1e1e1e', 'rgba(0,0,0,0.4)');
        // hubcap
        const [hx, hy] = b(0, 0, wz);
        ctx.fillStyle = '#8a8a8a'; ctx.beginPath(); ctx.ellipse(hx, hy, 3.2, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#d8d8d8'; ctx.beginPath(); ctx.ellipse(hx, hy, 1.5, 1.0, 0, 0, Math.PI * 2); ctx.fill();
      };

      // Wheels sit at the 4 corners, protruding past the body sides
      const wlf = halfL * 0.66, wlr = halfW + 0.02;
      // Draw far wheels first (smaller depth), near wheels after the body
      const farWheels  = [[-wlr, -wlf], [-wlr, wlf]];
      const nearWheels = [[ wlr, -wlf], [ wlr, wlf]];
      // Choose far/near set based on which side faces camera
      const wheelsFirst  = rightVis ? farWheels  : nearWheels;
      const wheelsSecond = rightVis ? nearWheels : farWheels;
      wheelsFirst.forEach(([lr, lf]) => drawWheel(lr, lf));

      // ── Lower body (chassis) — tapered: narrower at the front ──
      const fwW = halfW * 0.82;             // front is slightly narrower
      const z0 = wheelZ, z1 = wheelZ + bodyH;
      const FR0 = C(fwW, halfL, z0),  FL0 = C(-fwW, halfL, z0);
      const BL0 = C(-halfW, -halfL, z0), BR0 = C(halfW, -halfL, z0);
      const FR1 = C(fwW, halfL, z1),  FL1 = C(-fwW, halfL, z1);
      const BL1 = C(-halfW, -halfL, z1), BR1 = C(halfW, -halfL, z1);

      // hidden faces
      if (!frontVis) quad([BL1, BR1, BR0, BL0], '#9c1f1f');
      if (!rightVis) quad([FL1, BL1, BL0, FL0], '#8a1c1c');
      // visible side faces
      if (rightVis)  quad([BR1, FR1, FR0, BR0], '#b9302a');
      if (frontVis)  quad([FR1, FL1, FL0, FR0], '#cf3b34');
      // body top
      quad([FR1, FL1, BL1, BR1], '#e8554b');

      // Racing stripe down the centre of the hood/roof
      const SR1 = C(0.06, halfL, z1 + 0.001), SL1 = C(-0.06, halfL, z1 + 0.001);
      const SRb = C(0.06, -halfL, z1 + 0.001), SLb = C(-0.06, -halfL, z1 + 0.001);
      quad([SR1, SL1, SLb, SRb], '#f6e9c8', '');

      // Wheel arches (dark cutouts on visible side)
      ctx.fillStyle = 'rgba(0,0,0,0.32)';
      (rightVis ? [[wlr - 0.04, -wlf], [wlr - 0.04, wlf]] : [[-wlr + 0.04, -wlf], [-wlr + 0.04, wlf]])
        .forEach(([lr, lf]) => {
          const [ax, ay] = C(lr, lf, z0 + 0.02);
          ctx.beginPath(); ctx.ellipse(ax, ay, 6, 4, 0, Math.PI, 0); ctx.fill();
        });

      // ── Cabin / greenhouse (glass) ──
      const cW = halfW * 0.74, cFront = halfL * 0.18, cBack = -halfL * 0.62;
      const GF_R0 = C(cW, cFront, cabZ0), GF_L0 = C(-cW, cFront, cabZ0);
      const GB_L0 = C(-cW, cBack, cabZ0), GB_R0 = C(cW, cBack, cabZ0);
      const GF_R1 = C(cW * 0.86, cFront, cabH), GF_L1 = C(-cW * 0.86, cFront, cabH);
      const GB_L1 = C(-cW * 0.86, cBack, cabH), GB_R1 = C(cW * 0.86, cBack, cabH);

      if (!frontVis) quad([GB_L0, GB_R0, GB_R1, GB_L1], '#16344f');
      if (!rightVis) quad([GF_L0, GB_L0, GB_L1, GF_L1], '#13283c');
      if (rightVis)  quad([GF_R0, GB_R0, GB_R1, GF_R1], '#1d3f5e');
      // windshield (front glass, lighter, with glare)
      if (frontVis)  quad([GF_R0, GF_L0, GF_L1, GF_R1], '#3a6f9c');
      // roof
      quad([GF_R1, GF_L1, GB_L1, GB_R1], '#23475f');
      // windshield glare streak
      if (frontVis) {
        const gA = C(cW * 0.4, cFront, cabZ0 + 0.04), gB = C(cW * 0.1, cFront, cabH - 0.02);
        const gC = C(-cW * 0.05, cFront, cabH - 0.02), gD = C(cW * 0.25, cFront, cabZ0 + 0.04);
        quad([gA, gB, gC, gD], 'rgba(255,255,255,0.18)', '');
      }

      // ── Near wheels (in front of body) ──
      wheelsSecond.forEach(([lr, lf]) => drawWheel(lr, lf));

      // ── Headlights + beams (front) ──
      [[fwW * 0.62, halfL], [-fwW * 0.62, halfL]].forEach(([lr, lf]) => {
        const [hsx, hsy] = C(lr, lf, z0 + bodyH * 0.4);
        // beam cone
        const beamLen = 4.2;
        const bx = carX + fwX * (halfL + beamLen) + rgX * lr;
        const by = carY + fwY * (halfL + beamLen) + rgY * lr;
        const [b1x, b1y] = sp(bx + rgX * 0.8, by + rgY * 0.8, 0.04, camX, camY);
        const [b2x, b2y] = sp(bx - rgX * 0.8, by - rgY * 0.8, 0.04, camX, camY);
        const grad = ctx.createLinearGradient(hsx, hsy, bx, by);
        grad.addColorStop(0, 'rgba(255,250,190,0.34)'); grad.addColorStop(1, 'rgba(255,250,190,0)');
        ctx.fillStyle = grad; ctx.beginPath();
        ctx.moveTo(hsx, hsy); ctx.lineTo(b1x, b1y); ctx.lineTo(b2x, b2y); ctx.closePath(); ctx.fill();
        // bulb
        ctx.fillStyle = '#FFFBE0'; ctx.shadowColor = G1; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.ellipse(hsx, hsy, 3.5, 2.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      });

      // ── Taillights (rear) ──
      [[halfW * 0.62, -halfL], [-halfW * 0.62, -halfL]].forEach(([lr, lf]) => {
        const [tsx, tsy] = C(lr, lf, z0 + bodyH * 0.42);
        ctx.fillStyle = '#D81E1E'; ctx.shadowColor = '#FF3333'; ctx.shadowBlur = 7;
        ctx.beginPath(); ctx.ellipse(tsx, tsy, 2.6, 1.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      });
    }

    // ── Particle ───────────────────────────────────────────────────────────
    function drawParticle(p: Particle, camX: number, camY: number) {
      const [sx, sy] = sp(p.wx, p.wy, p.wz, camX, camY);
      ctx.save(); ctx.globalAlpha = p.alpha;
      if (p.type === 'star') {
        ctx.translate(sx, sy); ctx.rotate(p.rot);
        ctx.fillStyle = G1; ctx.shadowColor = G1; ctx.shadowBlur = 6;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r2 = i % 2 === 0 ? p.sz : p.sz * 0.42;
          const a = (i * Math.PI) / 5 - Math.PI / 2;
          i === 0 ? ctx.moveTo(Math.cos(a) * r2, Math.sin(a) * r2) : ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        }
        ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 5;
        ctx.beginPath(); ctx.arc(sx, sy, p.sz / 2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1; ctx.restore();
    }

    // ── HUD (amber monochrome) ─────────────────────────────────────────────
    function drawHUD(W: number, H: number) {
      // Speed panel
      ctx.fillStyle = GB; ctx.fillRect(14, 14, 158, 58);
      ctx.strokeStyle = G1; ctx.lineWidth = 1.5; ctx.strokeRect(14, 14, 158, 58);
      ctx.lineWidth = 2; ctx.strokeStyle = G1;
      ctx.beginPath(); ctx.moveTo(14, 24); ctx.lineTo(14, 14); ctx.lineTo(24, 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(172 - 10, 72); ctx.lineTo(172, 72); ctx.lineTo(172, 62); ctx.stroke();

      ctx.textAlign = 'left'; ctx.font = `bold 10px Cinzel,serif`; ctx.fillStyle = G1; ctx.fillText('SPEED', 24, 30);
      const pct = Math.min(1, Math.abs(carSpd) / 0.15);
      ctx.fillStyle = G3; ctx.fillRect(24, 37, 128, 7);
      ctx.fillStyle = pct > 0.75 ? '#FF8800' : pct > 0.4 ? G1 : G2; ctx.fillRect(24, 37, 128 * pct, 7);
      ctx.font = '9px Share Tech Mono,monospace'; ctx.fillStyle = G2;
      ctx.fillText(`${Math.round(Math.abs(carSpd) * 1800)} km/h`, 24, 56);

      // DRIFT indicator — flashes while sliding
      if (driftActive) {
        const a = 0.55 + Math.sin(performance.now() * 0.02) * 0.45;
        ctx.textAlign = 'left'; ctx.font = `bold 13px Cinzel,serif`;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.shadowColor = G1; ctx.shadowBlur = 10;
        ctx.fillText('✦ DRIFT ✦', 184, 38); ctx.shadowBlur = 0;
      }

      // Controls reminder (bottom-left)
      ctx.fillStyle = GB; ctx.fillRect(14, H - 58, 188, 44);
      ctx.strokeStyle = G3; ctx.lineWidth = 1; ctx.strokeRect(14, H - 58, 188, 44);
      ctx.textAlign = 'left'; ctx.font = '8px Share Tech Mono,monospace'; ctx.fillStyle = G2;
      ctx.fillText('W/↑  Accelerate   S/↓  Brake', 22, H - 42);
      ctx.fillText('A/←  Turn Left    D/→  Turn Right', 22, H - 28);

      // Center hint
      ctx.textAlign = 'center'; ctx.font = `bold 9px Share Tech Mono,monospace`;
      ctx.fillStyle = G2; ctx.fillText('CRASH INTO CUBE BUILDINGS TO OPEN SECTIONS', W / 2, H - 12);
    }

    // ── Smash ──────────────────────────────────────────────────────────────
    function smash(t: Tower) {
      if (t.state !== 'standing') return;
      t.state = 'fallen';
      const ox = t.cx - t.foot * CS / 2, oy = t.cy - t.foot * CS / 2;
      // Every voxel becomes flying debris in its own material colour
      for (const v of t.cells) {
        const wx = ox + v.gx * CS, wy = oy + v.gy * CS, wz = v.gz * CS;
        const dx = wx - t.cx, dy = wy - t.cy, d = Math.max(0.1, Math.hypot(dx, dy));
        const f = 0.06 + Math.random() * 0.1;
        const cols = v.mat === 'A' ? t.accCols : v.mat === 'D' ? t.darkCols : t.cols;
        flying.push({ wx: t.cx + dx, wy: t.cy + dy, wz, vx: (dx / d) * f + (Math.random() - 0.5) * 0.05, vy: (dy / d) * f + (Math.random() - 0.5) * 0.05, vz: 0.05 + Math.random() * 0.13 + v.gz * 0.01, rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.28, alpha: 1, cols });
      }
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2, f = 0.08 + Math.random() * 0.1;
        particles.push({ wx: t.cx, wy: t.cy, wz: t.maxH * CS * 0.5, vx: Math.cos(a) * f, vy: Math.sin(a) * f, vz: 0.1 + Math.random() * 0.1, col: G1, sz: 7 + Math.random() * 5, alpha: 1, rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.3, type: 'star' });
      }
      for (let i = 0; i < 10; i++) particles.push({ wx: t.cx + (Math.random() - 0.5) * 2, wy: t.cy + (Math.random() - 0.5) * 2, wz: t.maxH * CS * 0.3, vx: (Math.random() - 0.5) * 0.04, vy: (Math.random() - 0.5) * 0.04, vz: 0.09 + Math.random() * 0.07, col: t.bright, sz: 9, alpha: 1, rot: 0, rotV: 0, type: 'coin' });
    }

    // ── Game loop ──────────────────────────────────────────────────────────
    let raf: number;
    function frame() {
      const W = canvas.width, H = canvas.height, k = keys.current;

      // Live season swap (no rebuild) — refresh palette, reinit weather if changed
      PAL = themeRef.current;
      if (PAL.id !== curThemeId) { curThemeId = PAL.id; initWeather(); }

      // Respawn
      if (pendResp.current) {
        const id = pendResp.current; pendResp.current = null;
        const t = towers.find(x => x.id === id);
        if (t) { t.state = 'standing'; triggered.delete(id); }
        flying.length = 0; particles.length = 0;
        const tgt = towers.find(x => x.id === id);
        if (tgt) { carX = tgt.cx + tgt.foot * CS / 2 + 2.5; carY = tgt.cy; carAng = -Math.PI / 2; carSpd = 0; }
        carVX = 0; carVY = 0; skids.length = 0; dust.length = 0; smoke.length = 0;
        lastTrailX = carX; lastTrailY = carY;
        shake = 0; flash = 0;
      }

      // ── Drift car physics ──────────────────────────────────────────────
      // Heading (carAng) is independent from velocity (carVX, carVY): the car
      // turns its nose quickly, but momentum keeps sliding the old way, so every
      // turn breaks traction into a drift before grip pulls it back in line.
      const fX = Math.sin(carAng), fY = -Math.cos(carAng);   // heading forward
      const rX = Math.cos(carAng), rY = Math.sin(carAng);    // heading right

      const accelerating = k.has('arrowup') || k.has('w');
      const braking = k.has('arrowdown') || k.has('s');
      if (accelerating) { carVX += fX * 0.0030; carVY += fY * 0.0030; }  // slow, controlled throttle
      if (braking)      { carVX -= fX * 0.0024; carVY -= fY * 0.0024; }

      // Decompose velocity into forward + lateral (relative to current heading)
      let fwd = carVX * fX + carVY * fY;
      let lat = carVX * rX + carVY * rY;

      const spd = Math.hypot(carVX, carVY);

      // Steering — scales with speed; reversed when driving backwards.
      // Holding brake = handbrake: sharper steer + looser grip = big drifts.
      if (spd > 0.003) {
        const handbrake = braking ? 1.4 : 1.0;
        const steer = 0.046 * Math.min(1, spd / 0.085) * handbrake * (fwd >= 0 ? 1 : -1);
        if (k.has('arrowleft')  || k.has('a')) carAng -= steer;
        if (k.has('arrowright') || k.has('d')) carAng += steer;
      }

      // Grip: forward drag, low lateral grip → the slide. Higher drag = lower top speed.
      fwd *= 0.970;
      const grip = braking ? 0.74 : 0.88;   // lower = more drift
      lat *= grip;
      fwd = Math.max(-0.09, Math.min(0.15, fwd));

      // Recompose velocity from the NEW heading basis (this is what makes the
      // car visually point into the corner while sliding outward).
      const nfX = Math.sin(carAng), nfY = -Math.cos(carAng);
      const nrX = Math.cos(carAng), nrY = Math.sin(carAng);
      carVX = nfX * fwd + nrX * lat;
      carVY = nfY * fwd + nrY * lat;
      carSpd = fwd;                          // HUD reads forward speed

      // Drift detection — meaningful lateral slide at speed
      const driftAmt = Math.abs(lat);
      const drifting = driftAmt > 0.045 && spd > 0.05;
      driftActive = drifting;

      // Tyre trail — laid down continuously from all four wheels while moving
      if (spd > 0.012 && Math.hypot(carX - lastTrailX, carY - lastTrailY) > 0.14) {
        for (const side of [-1, 1]) {
          // rear wheels
          const rwx = carX + nrX * (0.24 * side) - nfX * 0.30;
          const rwy = carY + nrY * (0.24 * side) - nfY * 0.30;
          skids.push({ wx: rwx, wy: rwy, a: 0.36, w: 4 });
          // front wheels (lighter)
          const fwx = carX + nrX * (0.24 * side) + nfX * 0.30;
          const fwy = carY + nrY * (0.24 * side) + nfY * 0.30;
          skids.push({ wx: fwx, wy: fwy, a: 0.24, w: 3.4 });
        }
        lastTrailX = carX; lastTrailY = carY;
      }

      // Bolder drift skids + dust kicked from the rear wheels while sliding
      if (drifting) {
        for (const side of [-1, 1]) {
          const wx = carX + nrX * (0.24 * side) - nfX * 0.34;
          const wy = carY + nrY * (0.24 * side) - nfY * 0.34;
          skids.push({ wx, wy, a: Math.min(0.7, 0.45 + driftAmt * 3), w: 6 });
          if (Math.random() < 0.6)
            dust.push({ wx, wy, wz: 0.05,
              vx: -nfX * 0.02 + (Math.random() - 0.5) * 0.03,
              vy: -nfY * 0.02 + (Math.random() - 0.5) * 0.03,
              vz: 0.025 + Math.random() * 0.03, a: 0.5, sz: 4 + Math.random() * 5 });
        }
      }
      if (skids.length > 900) skids.splice(0, skids.length - 900);

      // Exhaust smoke from the tailpipe (rear-centre, low, more under throttle)
      const exX = carX - nfX * 0.5 + nrX * 0.12, exY = carY - nfY * 0.5 + nrY * 0.12;
      if (Math.random() < (accelerating ? 0.7 : 0.2)) {
        smoke.push({ wx: exX, wy: exY, wz: 0.07,
          vx: -nfX * 0.012 + (Math.random() - 0.5) * 0.008,
          vy: -nfY * 0.012 + (Math.random() - 0.5) * 0.008,
          vz: 0.012 + Math.random() * 0.016,
          a: accelerating ? 0.4 : 0.26, sz: 2.5 + Math.random() * 2.5 });
      }

      // Boundary-respecting movement (bounce off walls, killing momentum)
      const nX = carX + carVX, nY = carY + carVY;
      if (nX >= BORDER && nX <= WORLD - BORDER) carX = nX; else carVX *= -0.4;
      if (nY >= BORDER && nY <= WORLD - BORDER) carY = nY; else carVY *= -0.4;
      carX = Math.max(BORDER, Math.min(WORLD - BORDER, carX));
      carY = Math.max(BORDER, Math.min(WORLD - BORDER, carY));

      // Fade skids (temporary); update dust; update exhaust smoke
      for (let si = skids.length - 1; si >= 0; si--) { skids[si].a -= 0.0026; if (skids[si].a <= 0) skids.splice(si, 1); }
      for (let di = dust.length - 1; di >= 0; di--) {
        const d = dust[di]; d.wx += d.vx; d.wy += d.vy; d.wz += d.vz; d.vz -= 0.004; d.a -= 0.02; d.sz += 0.3;
        if (d.a <= 0) dust.splice(di, 1);
      }
      for (let mi = smoke.length - 1; mi >= 0; mi--) {
        const m = smoke[mi];
        m.wx += m.vx; m.wy += m.vy; m.wz += m.vz; m.vz *= 0.97;   // rises, slows
        m.vx *= 0.96; m.vy *= 0.96; m.sz += 0.35; m.a -= 0.012;
        if (m.a <= 0) smoke.splice(mi, 1);
      }
      if (smoke.length > 160) smoke.splice(0, smoke.length - 160);

      // Collision
      for (const t of towers) {
        if (t.state !== 'standing' || triggered.has(t.id)) continue;
        if (Math.hypot(carX - t.cx, carY - t.cy) < HIT_R) {
          triggered.add(t.id); smash(t); shake = 16; flash = 0.85;
          const id = t.id; setTimeout(() => enterRef.current(id), 700);
        }
      }

      // Flying cube physics
      let fi = flying.length; while (fi--) {
        const f = flying[fi];
        f.wx += f.vx; f.wy += f.vy; f.wz += f.vz; f.vz -= 0.006;
        if (f.wz < 0) { f.wz = 0; f.vz *= -0.35; f.vx *= 0.82; f.vy *= 0.82; }
        f.rot += f.rotV; f.alpha = Math.max(0, f.alpha - 0.007);
        if (f.alpha <= 0) flying.splice(fi, 1);
      }
      let pi = particles.length; while (pi--) {
        const p = particles[pi];
        p.wx += p.vx; p.wy += p.vy; p.wz += p.vz; p.vz -= 0.008;
        p.rot += p.rotV; p.alpha -= 0.022;
        if (p.alpha <= 0) particles.splice(pi, 1);
      }
      shake *= 0.82; flash *= 0.78;

      // Camera
      const [camX, camY] = iso(carX, carY, 0);
      const now = performance.now();

      // Render
      ctx.save();
      if (shake > 0.5) ctx.translate((Math.random() - 0.5) * shake * 1.5, (Math.random() - 0.5) * shake * 1.5);

      ctx.fillStyle = PAL.bg; ctx.fillRect(0, 0, W, H);

      // Ground tiles
      const vR = 20, cgx = Math.round(carX), cgy = Math.round(carY);
      for (let gy = cgy - vR; gy < cgy + vR; gy++)
        for (let gx = cgx - vR; gx < cgx + vR; gx++)
          drawTile(Math.max(0, Math.min(WORLD - 1, gx)), Math.max(0, Math.min(WORLD - 1, gy)), camX, camY);

      // Tyre tracks / skid marks — flat decals on the ground, under everything
      for (const s of skids) {
        const [skx, sky] = sp(s.wx, s.wy, 0, camX, camY);
        ctx.fillStyle = `rgba(${PAL.skidRGB},${s.a})`;
        ctx.beginPath(); ctx.ellipse(skx, sky, s.w, s.w * 0.6, 0, 0, Math.PI * 2); ctx.fill();
      }

      // Boundary walls (drawn in iso order)
      drawBoundaryWalls(camX, camY);

      // Collect & sort render objects
      type RO = { d: number; gz: number; fn: () => void };
      const rq: RO[] = [];

      for (const tr of trees) rq.push({ d: tr.wx + tr.wy, gz: 0, fn: () => drawTree(tr.wx, tr.wy, tr.r, tr.dark, camX, camY) });
      for (const p of props) rq.push({ d: p.wx + p.wy, gz: 0, fn: () => drawProp(p, camX, camY) });
      for (const t of towers) if (t.state === 'standing') rq.push({ d: t.cx + t.cy, gz: 0, fn: () => drawTower(t, camX, camY, now) });
      for (const fc of flying) rq.push({ d: fc.wx + fc.wy, gz: fc.wz, fn: () => drawCube(fc.wx - CS / 2, fc.wy - CS / 2, fc.wz, CS, camX, camY, fc.cols, fc.alpha) });
      rq.push({ d: carX + carY, gz: 0, fn: () => drawCar(camX, camY) });
      for (const p of particles) rq.push({ d: p.wx + p.wy, gz: p.wz, fn: () => drawParticle(p, camX, camY) });
      // Sand dust puffs kicked up while drifting
      for (const d of dust) rq.push({ d: d.wx + d.wy, gz: d.wz, fn: () => {
        const [dx, dy] = sp(d.wx, d.wy, d.wz, camX, camY);
        ctx.fillStyle = `rgba(${PAL.dustRGB},${d.a})`;
        ctx.beginPath(); ctx.arc(dx, dy, d.sz, 0, Math.PI * 2); ctx.fill();
      } });
      // Exhaust smoke — soft grey puffs from the tailpipe
      for (const m of smoke) rq.push({ d: m.wx + m.wy, gz: m.wz, fn: () => {
        const [mx, my] = sp(m.wx, m.wy, m.wz, camX, camY);
        ctx.fillStyle = `rgba(105,105,105,${m.a})`;
        ctx.beginPath(); ctx.arc(mx, my, m.sz, 0, Math.PI * 2); ctx.fill();
      } });

      rq.sort((a, b) => a.d - b.d || a.gz - b.gz);
      for (const r of rq) r.fn();

      // Floating titles — top pass (depth-sorted so far towers draw first)
      [...towers].filter(t => t.state === 'standing')
        .sort((a, b) => (a.cx + a.cy) - (b.cx + b.cy))
        .forEach(t => drawFloatingTitle(t, camX, camY, now));

      if (flash > 0.01) { ctx.fillStyle = `rgba(255,245,200,${flash})`; ctx.fillRect(-20, -20, W + 40, H + 40); }
      ctx.restore();

      drawWeather(now);
      drawHUD(W, H);
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);   // mounts once; palette is swapped live via themeRef

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ cursor: 'crosshair' }} />;
};

export default GameWorld;
