import React, { useState, useEffect, useRef } from 'react';

export default function ShowcaseSuite() {
  const [activeModule, setActiveModule] = useState('inspector'); // inspector, safepath, rpg, instant, merge
  const audioCtxRef = useRef(null);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Sound effect triggers
  const playSfx = (type) => {
    try {
      const ctx = getAudioCtx();
      if (type === 'verify') {
        // High harmonic emerald chime
        [1046.5, 1318.5, 1567.98, 2093].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.05);
          gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.05);
          osc.stop(ctx.currentTime + 1.2);
        });
      } else if (type === 'dispute') {
        // Low double buzzer
        [180, 140].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.15);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.15);
          osc.stop(ctx.currentTime + idx * 0.15 + 0.12);
        });
      } else if (type === 'shutter') {
        // Camera click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'levelUp') {
        // RPG Level Up Fanfare
        [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + 1.4);
        });
      } else if (type === 'merge') {
        // Magnetic suck-in whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn('SFX trigger error:', e);
    }
  };

  /* -------------------------------------------------------------
   * MODULE 1: THE CORE AI FIX INSPECTOR (BEFORE / AFTER SLIDER)
   * ------------------------------------------------------------- */
  const [sliderPos, setSliderPos] = useState(50);
  const [inspectorMode, setInspectorMode] = useState('verified'); // verified | disputed
  const [showParticleBurst, setShowParticleBurst] = useState(false);

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderPos(val);
    if (val > 80 && !showParticleBurst) {
      setShowParticleBurst(true);
      playSfx(inspectorMode === 'verified' ? 'verify' : 'dispute');
      setTimeout(() => setShowParticleBurst(false), 2000);
    }
  };

  /* -------------------------------------------------------------
   * MODULE 2: SAFE PATH ROUTING (WOMEN-SAFETY MODE DYNAMIC HEATMAP)
   * ------------------------------------------------------------- */
  const [safetyMode, setSafetyMode] = useState(true);
  const [safetyScore, setSafetyScore] = useState(9.4);

  useEffect(() => {
    if (safetyMode) {
      let current = 0.0;
      const interval = setInterval(() => {
        current += 0.4;
        if (current >= 9.4) {
          setSafetyScore(9.4);
          clearInterval(interval);
        } else {
          setSafetyScore(parseFloat(current.toFixed(1)));
        }
      }, 40);
      return () => clearInterval(interval);
    } else {
      setSafetyScore(5.2);
    }
  }, [safetyMode]);

  /* -------------------------------------------------------------
   * MODULE 3: CIVIC SCORE RPG LEVEL-UP & ANTI-SPAM GAMIFICATION
   * ------------------------------------------------------------- */
  const [xp, setXp] = useState(450);
  const [rank, setRank] = useState('Citizen Sentinel');
  const [isFlipping, setIsFlipping] = useState(false);
  const [showXpArc, setShowXpArc] = useState(false);

  const addXp = () => {
    setShowXpArc(true);
    playSfx('shutter');
    const newXp = xp + 50;
    setXp(newXp);

    if (newXp >= 500 && rank === 'Citizen Sentinel') {
      setTimeout(() => {
        setIsFlipping(true);
        playSfx('levelUp');
        setRank('Master Verifier');
        setTimeout(() => setIsFlipping(false), 1200);
      }, 400);
    }

    setTimeout(() => setShowXpArc(false), 1200);
  };

  /* -------------------------------------------------------------
   * MODULE 4: 3-SECOND "INSTANT REPORT" HUD VIEWFINDER
   * ------------------------------------------------------------- */
  const [hudStep, setHudStep] = useState(0); // 0: Detecting, 1: High Severity, 2: GPS Locked, 3: Captured
  const [isCaptured, setIsCaptured] = useState(false);

  useEffect(() => {
    if (activeModule === 'instant' && !isCaptured) {
      const timer = setInterval(() => {
        setHudStep((prev) => (prev + 1) % 3);
      }, 900);
      return () => clearInterval(timer);
    }
  }, [activeModule, isCaptured]);

  const handleCapture = () => {
    playSfx('shutter');
    setIsCaptured(true);
    setTimeout(() => setIsCaptured(false), 3000);
  };

  /* -------------------------------------------------------------
   * MODULE 5: DUPLICATE COMPLAINT MERGING (PUBLIC DASHBOARD LIVE MAP)
   * ------------------------------------------------------------- */
  const [isMerged, setIsMerged] = useState(false);

  const toggleMerge = () => {
    if (!isMerged) {
      playSfx('merge');
      setIsMerged(true);
    } else {
      setIsMerged(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem 3rem 1rem' }}>
      
      {/* Top Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800' }}>
              INTERACTIVE SUITE
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
              FixTrack Core Feature Visual Showcase
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            5 High-Impact Interactive Demos: AI Verification Slider, SafePath, RPG Gamification, Instant HUD, & Deduplication
          </p>
        </div>

        {/* Module Switcher Pills */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '4px' }}>
          {[
            { id: 'inspector', label: '1. AI Fix Inspector', icon: '🔍' },
            { id: 'safepath', label: '2. Safe Path Routing', icon: '🛣️' },
            { id: 'rpg', label: '3. Civic RPG Level-Up', icon: '🛡️' },
            { id: 'instant', label: '4. 3-Sec HUD Viewfinder', icon: '📱' },
            { id: 'merge', label: '5. Complaint Merging', icon: '📡' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: activeModule === m.id ? 'var(--primary)' : 'transparent',
                color: activeModule === m.id ? '#fff' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: activeModule === m.id ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s'
              }}>
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================
       * MODULE 1: THE CORE AI FIX INSPECTOR (BEFORE / AFTER SLIDER)
       * ========================================================= */}
      {activeModule === 'inspector' && (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔍</span> The Core AI Fix Inspector &bull; Before / After Verification
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Slide across the defect to trigger AI edge verification. Toggle between Verified vs Disputed test states.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setInspectorMode('verified')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: inspectorMode === 'verified' ? '1px solid #10b981' : '1px solid var(--border-color)',
                  background: inspectorMode === 'verified' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: inspectorMode === 'verified' ? '#6ee7b7' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}>
                State: Verified Fix
              </button>
              <button
                onClick={() => setInspectorMode('disputed')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: inspectorMode === 'disputed' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  background: inspectorMode === 'disputed' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                  color: inspectorMode === 'disputed' ? '#fca5a5' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}>
                State: Disputed Resolution
              </button>
            </div>
          </div>

          {/* Interactive Split Screen Viewport */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            borderRadius: '14px',
            overflow: 'hidden',
            border: inspectorMode === 'disputed' && sliderPos > 60 ? '2px solid #ef4444' : '1px solid var(--border-color)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            
            {/* BASE: BEFORE PHOTO (Broken Pothole with Neon Cyan Box) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 40% 60%, #1e293b 0%, #090d16 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Defect Pothole */}
              <div style={{
                width: '320px',
                height: '140px',
                borderRadius: '50%',
                background: '#030712',
                border: '3px solid #334155',
                boxShadow: 'inset 0 15px 35px rgba(0,0,0,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{ width: '240px', height: '80px', borderRadius: '50%', background: '#0f172a', opacity: 0.8 }} />
              </div>

              {/* Pulsing Neon Cyan Bounding Box */}
              <div style={{
                position: 'absolute',
                width: '380px',
                height: '190px',
                borderRadius: '12px',
                border: '2px solid #38bdf8',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.5), inset 0 0 15px rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: '8px'
              }}>
                <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  DEFECT: ROAD_HAZARD #894
                </span>
              </div>

              <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                BEFORE: REPORTED DEFECT
              </div>
            </div>

            {/* OVERLAY: AFTER PHOTO (Clipped by Slider) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(0 0 0 ${sliderPos}%)`,
              background: inspectorMode === 'verified'
                ? 'radial-gradient(ellipse at 60% 60%, #064e3b 0%, #022c22 100%)'
                : 'radial-gradient(ellipse at 60% 60%, #450a0a 0%, #1c0505 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'clip-path 0.05s ease-out'
            }}>
              {inspectorMode === 'verified' ? (
                /* Repaired Smooth Asphalt */
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '320px',
                    height: '140px',
                    borderRadius: '50%',
                    background: '#1e293b',
                    border: '2px dashed #10b981',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      FRESH COLD-MIX ASPHALT SEAL
                    </span>
                  </div>

                  {/* 3D Emerald Green Checkmark Badge with Particle Ripple */}
                  <div style={{
                    marginTop: '1.25rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(16, 185, 129, 0.25)',
                    border: '2px solid #10b981',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    color: '#fff',
                    fontWeight: '900',
                    fontSize: '0.95rem'
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>✓</span>
                    <span>AI VERIFIED RESOLUTION</span>
                  </div>
                </div>
              ) : (
                /* Fake Fix / Disputed State */
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '320px',
                    height: '140px',
                    borderRadius: '50%',
                    background: '#18181b',
                    border: '3px solid #ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      DEFECT STILL VISIBLE &bull; 0% ASPHALT DELTA
                    </span>
                  </div>

                  {/* Disputed Floating Warning Pill */}
                  <div style={{
                    marginTop: '1.25rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(239, 68, 68, 0.3)',
                    border: '2px solid #ef4444',
                    boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    color: '#fff',
                    fontWeight: '900',
                    fontSize: '0.95rem'
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>⚠️</span>
                    <span>DISPUTED RESOLUTION (REJECTED)</span>
                  </div>
                </div>
              )}

              <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', color: '#6ee7b7', fontFamily: 'monospace' }}>
                AFTER: AI CONTRACTOR AUDIT
              </div>
            </div>

            {/* Continuous Vertical Laser Scanning Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${sliderPos}%`,
              width: '2px',
              background: '#fff',
              boxShadow: '0 0 15px #38bdf8, 0 0 30px #0ea5e9',
              pointerEvents: 'none',
              zIndex: 30
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#090d16',
                border: '2px solid #38bdf8',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.8)'
              }}>
                ↔
              </div>
            </div>

          </div>

          {/* Slider Range Controller */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
              <span>◀ Slide Left: BEFORE (Defect)</span>
              <span>Slide Right: AFTER (Audit) ▶</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={handleSliderChange}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'ew-resize' }}
            />
          </div>
        </div>
      )}

      {/* =========================================================
       * MODULE 2: SAFE PATH ROUTING (WOMEN-SAFETY MODE HEATMAP)
       * ========================================================= */}
      {activeModule === 'safepath' && (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🛣️</span> Safe Path Routing &bull; Dynamic Night Heatmap
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Primary daily retention engine: Real-time illumination, active crowd density, and safe sanctuary routing.
              </p>
            </div>

            {/* Toggle Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: safetyMode ? '#10b981' : 'var(--text-muted)' }}>
                WOMEN-SAFETY MODE: {safetyMode ? 'ON' : 'OFF'}
              </span>
              <button
                onClick={() => setSafetyMode(!safetyMode)}
                style={{
                  width: '52px',
                  height: '28px',
                  borderRadius: '14px',
                  background: safetyMode ? '#10b981' : '#334155',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}>
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  left: safetyMode ? '26px' : '4px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.3s',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.4)'
                }} />
              </button>
            </div>
          </div>

          {/* Vector Map Canvas Area */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at 50% 50%, #090e17 0%, #030712 100%)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            {/* SVG Dark Mode Grid & Street Vectors */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              {/* City Grid Roads */}
              <line x1="50" y1="80" x2="950" y2="80" stroke="rgba(255,255,255,0.08)" strokeWidth="18" />
              <line x1="50" y1="200" x2="950" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="24" />
              <line x1="50" y1="310" x2="950" y2="310" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
              <line x1="220" y1="20" x2="220" y2="360" stroke="rgba(255,255,255,0.08)" strokeWidth="18" />
              <line x1="500" y1="20" x2="500" y2="360" stroke="rgba(255,255,255,0.08)" strokeWidth="26" />
              <line x1="780" y1="20" x2="780" y2="360" stroke="rgba(255,255,255,0.08)" strokeWidth="18" />

              {/* Isolated Dark Alley (Turns deep violet with warning when safety mode ON) */}
              <path
                d="M 500 200 L 780 310"
                stroke={safetyMode ? 'rgba(147, 51, 234, 0.4)' : 'rgba(255,255,255,0.1)'}
                strokeWidth="12"
                strokeDasharray="4 4"
              />

              {/* ROUTE POLYLINE */}
              {safetyMode ? (
                /* Safe Path Neon Emerald Gradient */
                <path
                  d="M 120 200 L 500 200 L 500 80 L 850 80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 15px #10b981)' }}
                />
              ) : (
                /* Standard Route Soft Blue Light */
                <path
                  d="M 120 200 L 500 200 L 780 310 L 850 310"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 10px #38bdf8)' }}
                />
              )}
            </svg>

            {/* Illuminated Streetlamps & Crowd Glow (when safety mode ON) */}
            {safetyMode && (
              <>
                <div style={{ position: 'absolute', top: '65px', left: '320px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.25)', filter: 'blur(15px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '65px', left: '640px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.25)', filter: 'blur(15px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '185px', left: '320px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.25)', filter: 'blur(18px)', pointerEvents: 'none' }} />

                {/* Streetlamp Icons */}
                <div style={{ position: 'absolute', top: '68px', left: '350px', fontSize: '16px' }}>💡</div>
                <div style={{ position: 'absolute', top: '68px', left: '670px', fontSize: '16px' }}>💡</div>
                <div style={{ position: 'absolute', top: '188px', left: '350px', fontSize: '16px' }}>🛡️ Pink Booth</div>

                {/* Warning on dark alley */}
                <div style={{ position: 'absolute', top: '240px', left: '610px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontFamily: 'monospace' }}>
                  ⚠ Unlit Alley Avoided
                </div>
              </>
            )}

            {/* Start Pin */}
            <div style={{ position: 'absolute', top: '180px', left: '105px', transform: 'translate(-50%, -50%)', background: '#3b82f6', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 0 15px #3b82f6' }}>
              A
            </div>

            {/* Destination Pin */}
            <div style={{ position: 'absolute', top: safetyMode ? '70px' : '300px', left: '850px', transform: 'translate(-50%, -50%)', background: safetyMode ? '#10b981' : '#f59e0b', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 0 15px rgba(16, 185, 129, 0.8)' }}>
              B
            </div>

            {/* Floating Glass Card (Slide in from bottom) */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '20px',
              right: '20px',
              background: 'rgba(15, 23, 42, 0.88)',
              border: `1px solid ${safetyMode ? '#10b981' : 'var(--border-color)'}`,
              backdropFilter: 'blur(16px)',
              borderRadius: '12px',
              padding: '12px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {safetyMode ? 'ACTIVE NAVIGATION: SAFE HAVEN CORRIDOR' : 'STANDARD COMMUTE ROUTE'}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: safetyMode ? '#10b981' : '#38bdf8' }}>
                  Safety Index: {safetyScore} / 10
                  <span style={{ fontSize: '0.78rem', fontWeight: 'normal', color: '#cbd5e1', marginLeft: '8px' }}>
                    {safetyMode ? '(Highly Lit, CCTV & Active Patrols)' : '(Standard Traffic Speed Priority)'}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8' }}>
                <div>Distance: <strong>1.4 km</strong></div>
                <div>Est. Walk: <strong>18 mins</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * MODULE 3: CIVIC SCORE RPG LEVEL-UP & ANTI-SPAM GAMIFICATION
       * ========================================================= */}
      {activeModule === 'rpg' && (
        <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span>🛡️</span> Civic Score RPG Level-Up & Anti-Spam Gamification
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Earn trust points for verified community reports. High-trust users unlock instant 1-click authority dispatch.
            </p>
          </div>

          {/* 3D Hexagonal Badge Container */}
          <div style={{
            position: 'relative',
            width: '260px',
            height: '260px',
            margin: '0 auto 1.5rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1000px'
          }}>
            {/* Hexagon Shield */}
            <div style={{
              width: '200px',
              height: '220px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '3px solid #38bdf8',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              boxShadow: '0 0 35px rgba(56, 189, 248, 0.4), inset 0 0 25px rgba(56, 189, 248, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: isFlipping ? 'rotateY(360deg)' : 'rotateY(0deg)',
              transition: isFlipping ? 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}>
              <span style={{ fontSize: '2.5rem' }}>{rank === 'Master Verifier' ? '👑' : '🛡️'}</span>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.08em', marginTop: '6px' }}>
                RANK TIER
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#fff' }}>
                {rank}
              </div>
            </div>

            {/* +50 XP Arc Indicator */}
            {showXpArc && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                background: '#10b981',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontWeight: '900',
                fontSize: '0.85rem',
                boxShadow: '0 0 20px #10b981',
                animation: 'bounce 0.8s ease'
              }}>
                +50 XP VERIFIED REPORT
              </div>
            )}
          </div>

          {/* XP Progress Bar & Counter */}
          <div style={{ maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
              <span style={{ color: 'var(--text-muted)' }}>Experience Points</span>
              <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{xp} / 500 XP</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (xp / 500) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', transition: 'width 0.4s' }} />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={addXp}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.8rem', fontSize: '0.9rem' }}>
            ⚡ Submit Verified Report (+50 XP)
          </button>
        </div>
      )}

      {/* =========================================================
       * MODULE 4: 3-SECOND "INSTANT REPORT" HUD VIEWFINDER
       * ========================================================= */}
      {activeModule === 'instant' && (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📱</span> 3-Second "Instant Report" HUD Viewfinder
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Zero-friction civic reporting. Auto-scaling corner reticle, cycling neural tags, and instant glide capture.
            </p>
          </div>

          {/* Mobile Camera Frame Viewfinder */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            {/* Defect in Crosshairs */}
            <div style={{
              width: '260px',
              height: '110px',
              borderRadius: '50%',
              background: '#030712',
              border: '2px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ width: '190px', height: '60px', borderRadius: '50%', background: '#090d16', opacity: 0.9 }} />
            </div>

            {/* Auto-Scaling Dynamic Corner Reticle */}
            <div style={{
              position: 'absolute',
              width: isCaptured ? '140px' : '320px',
              height: isCaptured ? '70px' : '160px',
              border: '2px solid rgba(56, 189, 248, 0.6)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
              <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '14px', height: '14px', borderTop: '3px solid #38bdf8', borderLeft: '3px solid #38bdf8' }} />
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', borderTop: '3px solid #38bdf8', borderRight: '3px solid #38bdf8' }} />
              <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '14px', height: '14px', borderBottom: '3px solid #38bdf8', borderLeft: '3px solid #38bdf8' }} />
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '14px', height: '14px', borderBottom: '3px solid #38bdf8', borderRight: '3px solid #38bdf8' }} />

              {/* Animated Cycling AI Floating Tags */}
              <div style={{
                position: 'absolute',
                top: '-32px',
                background: 'rgba(8, 47, 73, 0.95)',
                border: '1px solid #38bdf8',
                color: '#38bdf8',
                padding: '3px 10px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
              }}>
                {hudStep === 0 && '⚡ Detecting road surface...'}
                {hudStep === 1 && '🚨 Pothole / High Severity (0.94)'}
                {hudStep === 2 && '📍 GPS Locked: 28.6139° N, 77.2090° E'}
              </div>
            </div>

            {/* Bottom Camera Action Bar with Capture Shutter */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.85)',
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(12px)'
            }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                Mode: AI Auto-Survey
              </span>

              {/* Shutter Button */}
              <button
                onClick={handleCapture}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: '3px solid #fff',
                  padding: '3px',
                  cursor: 'pointer'
                }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: isCaptured ? '#10b981' : '#f43f5e',
                  transition: 'background 0.2s'
                }} />
              </button>

              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: isCaptured ? '#10b981' : '#38bdf8', fontWeight: 'bold' }}>
                {isCaptured ? '✓ DISPATCHED (<1s)' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * MODULE 5: DUPLICATE COMPLAINT MERGING (LIVE MAP DEDUPLICATION)
       * ========================================================= */}
      {activeModule === 'merge' && (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📡</span> Duplicate Complaint Merging &bull; PostGIS Proximity Cluster
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Multiple citizens reporting the same pothole are magnetically pulled into a single high-priority work order.
              </p>
            </div>

            <button
              onClick={toggleMerge}
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}>
              {isMerged ? 'Reset Scatter View' : '⚡ Simulate AI Merge'}
            </button>
          </div>

          {/* Map Area */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: 'radial-gradient(circle at 50% 50%, #032b43 0%, #030712 100%)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            {/* SVG Connecting Magnetic Pulse Lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              {!isMerged && (
                <>
                  <line x1="500" y1="190" x2="380" y2="120" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="500" y1="190" x2="620" y2="110" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="500" y1="190" x2="390" y2="260" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="500" y1="190" x2="630" y2="270" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                </>
              )}
            </svg>

            {/* Central Merged Node or Central Pin */}
            <div style={{
              position: 'absolute',
              top: '190px',
              left: '500px',
              transform: 'translate(-50%, -50%)',
              zIndex: 30
            }}>
              {isMerged ? (
                /* Primary 3D Pulse Node with Badge */
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                    boxShadow: '0 0 40px rgba(244, 63, 94, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    margin: '0 auto',
                    border: '3px solid #fff'
                  }}>
                    🚨
                  </div>
                  <div style={{
                    marginTop: '8px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '2px solid #f43f5e',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    fontWeight: '900',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.8)'
                  }}>
                    5 Reports Merged &bull; High Priority
                  </div>
                </div>
              ) : (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ef4444', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                  📍
                </div>
              )}
            </div>

            {/* Outer Scatter Pins (Pulled inward when merged) */}
            <div style={{
              position: 'absolute',
              top: isMerged ? '190px' : '120px',
              left: isMerged ? '500px' : '380px',
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              opacity: isMerged ? 0 : 1,
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}>
              📍
            </div>

            <div style={{
              position: 'absolute',
              top: isMerged ? '190px' : '110px',
              left: isMerged ? '500px' : '620px',
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              opacity: isMerged ? 0 : 1,
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}>
              📍
            </div>

            <div style={{
              position: 'absolute',
              top: isMerged ? '190px' : '260px',
              left: isMerged ? '500px' : '390px',
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              opacity: isMerged ? 0 : 1,
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}>
              📍
            </div>

            <div style={{
              position: 'absolute',
              top: isMerged ? '190px' : '270px',
              left: isMerged ? '500px' : '630px',
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              opacity: isMerged ? 0 : 1,
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}>
              📍
            </div>

            {/* Bottom Status Bar */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '20px',
              right: '20px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '8px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#cbd5e1'
            }}>
              <span>Algorithm: PostGIS <code>ST_DWithin(25m)</code> Clustering</span>
              <span style={{ color: isMerged ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                {isMerged ? 'Status: Merged into Single Incident #409' : 'Status: 5 Disparate Reports Detected'}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

