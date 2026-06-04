import React, { useState, useCallback, useRef } from 'react';
import LoadingScreen      from './components/LoadingScreen';
import GameWorld          from './components/GameWorld';
import LocationTransition from './components/LocationTransition';
import SectionPanel       from './components/SectionPanel';
import ControlsHint       from './components/ControlsHint';
import ThemeToggle        from './components/ThemeToggle';
import SeasonTransition   from './components/SeasonTransition';
import { PORTALS }        from './components/gameData';
import type { Portal }    from './components/gameData';
import { THEMES, seasonForMonth, type Season } from './components/themes';

const STORE_KEY = 'portfolio-season';

const initialSeason = (): Season => {
  const saved = (typeof localStorage !== 'undefined' && localStorage.getItem(STORE_KEY)) as Season | null;
  if (saved && THEMES[saved]) return saved;
  return seasonForMonth(new Date().getMonth());
};

const App: React.FC = () => {
  const [gameReady,   setGameReady]   = useState(false);
  const [transitPort, setTransitPort] = useState<Portal | null>(null);
  const [openId,      setOpenId]      = useState<string | null>(null);
  const [respawnAt,   setRespawnAt]   = useState<string | null>(null);
  const lastCrashedId                 = useRef<string | null>(null);

  // Seasonal theme
  const [season,        setSeason]        = useState<Season>(initialSeason);
  const [seasonLoading, setSeasonLoading] = useState<Season | null>(null);

  const panelOpen     = openId !== null;
  const overlayActive = transitPort !== null || panelOpen;

  // ── Season switching ──
  const requestSeason = useCallback((s: Season) => {
    if (s === season) return;
    // Apply the new season immediately (the loader covers the rebuild flash)…
    setSeason(s);
    try { localStorage.setItem(STORE_KEY, s); } catch { /* ignore */ }
    // …and show the themed transition loader over it.
    setSeasonLoading(s);
  }, [season]);

  const handleSeasonLoaded = useCallback(() => setSeasonLoading(null), []);

  // ── Crash → section flow ──
  const handleEnter = useCallback((id: string) => {
    const portal = PORTALS.find(p => p.id === id) ?? null;
    if (!portal) return;
    lastCrashedId.current = id;
    setTransitPort(portal);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setOpenId(lastCrashedId.current);
  }, []);

  const handleTransitionGone = useCallback(() => {
    setTransitPort(null);
  }, []);

  const handleClose = useCallback(() => {
    const id = lastCrashedId.current;
    setOpenId(null);
    if (id) setRespawnAt(id);
  }, []);

  const handleRespawned = useCallback(() => setRespawnAt(null), []);
  const handleNavigate  = useCallback((id: string) => setOpenId(id), []);

  return (
    <>
      {gameReady && (
        <GameWorld
          theme={THEMES[season]}
          onEnter={handleEnter}
          respawnAt={respawnAt}
          onRespawned={handleRespawned}
        />
      )}

      {/* Season toggle — only on the live game screen */}
      {gameReady && !overlayActive && !seasonLoading && (
        <ThemeToggle current={season} onChange={requestSeason} />
      )}

      {gameReady && !overlayActive && !seasonLoading && <ControlsHint />}

      {/* Boot loading screen */}
      {!gameReady && <LoadingScreen onDone={() => setGameReady(true)} />}

      {/* Themed season-change loader (covers the world rebuild) */}
      {seasonLoading && (
        <SeasonTransition key={seasonLoading} theme={THEMES[seasonLoading]} onDone={handleSeasonLoaded} />
      )}

      {/* Opaque backstop — covers game world the instant any overlay activates */}
      {overlayActive && (
        <div className="fixed inset-0 z-[48]" style={{ background: 'rgb(4,8,14)' }} />
      )}

      {transitPort && (
        <LocationTransition
          key={transitPort.id}
          portal={transitPort}
          onComplete={handleTransitionComplete}
          onGone={handleTransitionGone}
        />
      )}

      {panelOpen && (
        <SectionPanel
          locationId={openId}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
};

export default App;
