import React, { useState, useEffect, useRef } from 'react';

export default function PitchDemo() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [timer, setTimer] = useState(0);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Rain particle effect on left side
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const drops = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 12 + 8,
      spd: Math.random() * 4 + 5
    }));

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of drops) {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.len);
        d.y += d.spd;
        if (d.y > height) {
          d.y = -10;
          d.x = Math.random() * width;
        }
      }
      ctx.stroke();
      animId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  // Web Audio Synthesizer for Left vs Right SFX
  const playSoundEffects = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;

      // 1. Left side monotone bureaucratic buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);

      // 2. Right side camera shutter click + affirmative harmonic chime (after 600ms)
      setTimeout(() => {
        // Click
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(1200, ctx.currentTime);
        clickOsc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
        clickGain.gain.setValueAtTime(0.3, ctx.currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start();
        clickOsc.stop(ctx.currentTime + 0.05);

        // Harmonic Chime (E6 & B6)
        [1318.51, 1975.53].forEach((f, i) => {
          const chimeOsc = ctx.createOscillator();
          const chimeGain = ctx.createGain();
          chimeOsc.type = 'triangle';
          chimeOsc.frequency.setValueAtTime(f, ctx.currentTime + 0.06 + i * 0.04);
          chimeGain.gain.setValueAtTime(0.18, ctx.currentTime + 0.06 + i * 0.04);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);
          chimeOsc.connect(chimeGain);
          chimeGain.connect(ctx.destination);
          chimeOsc.start(ctx.currentTime + 0.06 + i * 0.04);
          chimeOsc.stop(ctx.currentTime + 1.1);
        });
      }, 600);

      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2000);
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem 3rem 1rem' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ background: 'rgba(244, 63, 94, 0.2)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800' }}>
              SCENE 1 (0:00 - 0:06)
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
              The Frustration &bull; Motion Graphics Concept
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Vertical Split-Screen: Traditional Civic App Frustration vs. FixTrack 1-Click AR AI
          </p>
        </div>

        <button
          onClick={playSoundEffects}
          className="btn btn-primary"
          style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}>
          <span>{isPlayingAudio ? '🔊 Playing...' : '▶ Play Scene 1 Audio & SFX'}</span>
        </button>
      </div>

      {/* 16:9 Split Screen Stage */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
      }}>
        
        {/* LEFT HALF: Traditional App */}
        <div style={{
          position: 'relative',
          width: '50%',
          height: '100%',
          background: 'radial-gradient(ellipse at 30% 70%, #171c26 0%, #090c12 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Rain canvas */}
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.5 }} />

          {/* Left Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
              TRADITIONAL 311 PORTAL
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
              Camera: Low-angle tracking
            </span>
          </div>

          {/* Center Graphic: Untouched deep dark pothole in rain */}
          <div style={{ position: 'relative', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '210px',
              height: '75px',
              borderRadius: '50%',
              background: '#04060a',
              border: '3px solid #334155',
              boxShadow: 'inset 0 10px 25px rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ width: '160px', height: '45px', borderRadius: '50%', background: 'linear-gradient(90deg, #0f172a, #1e293b, #090d16)', opacity: 0.7 }} />
              {/* Rain ripple */}
              <div style={{ position: 'absolute', width: '30px', height: '15px', borderRadius: '50%', border: '1px solid rgba(148, 163, 184, 0.5)' }} />
            </div>
          </div>

          {/* Cluttered Phone Screen with ironic STATUS: RESOLVED */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '0.75rem',
            maxWidth: '240px',
            margin: '0 auto',
            zIndex: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,0.7)'
          }}>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', borderBottom: '1px solid #1e293b', paddingBottom: '3px', marginBottom: '4px' }}>
              Civic Form 404-B &bull; 6 required text fields
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.62rem', color: '#64748b' }}>
              <div style={{ background: '#0b0f19', padding: '2px 5px', borderRadius: '3px' }}>Ward District: Central Zone 4</div>
              <div style={{ background: '#0b0f19', padding: '2px 5px', borderRadius: '3px' }}>Sub-category: Pothole &gt; 50mm</div>
            </div>

            {/* Deceptive Pop-up */}
            <div style={{
              marginTop: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1.5px solid #10b981',
              color: '#6ee7b7',
              borderRadius: '6px',
              padding: '4px 6px',
              textAlign: 'center',
              fontWeight: '800',
              fontSize: '0.68rem'
            }}>
              ✓ STATUS: RESOLVED
              <div style={{ fontSize: '0.58rem', fontWeight: '400', color: '#a7f3d0' }}>Ticket closed by system</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#fca5a5', fontWeight: '600', zIndex: 10 }}>
            ⚠️ Reality: Pothole completely untouched & hazardous
          </div>
        </div>

        {/* RIGHT HALF: FixTrack AI */}
        <div style={{
          position: 'relative',
          width: '50%',
          height: '100%',
          background: 'radial-gradient(circle at 70% 30%, #032b43 0%, #050b14 100%)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}>
          {/* Subtle Grid */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.15,
            pointerEvents: 'none'
          }} />

          {/* Right Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#38bdf8', background: 'rgba(14, 165, 233, 0.2)', border: '1px solid #38bdf8', padding: '2px 8px', borderRadius: '4px', boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)' }}>
              FIXTRACK AR VISION AI
            </span>
            <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontFamily: 'monospace' }}>
              ● 1-CLICK INSTANT AR CAPTURE
            </span>
          </div>

          {/* AR Viewfinder framing identical Pothole */}
          <div style={{ position: 'relative', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Pothole on right */}
            <div style={{
              width: '210px',
              height: '75px',
              borderRadius: '50%',
              background: '#04060a',
              border: '3px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ width: '160px', height: '45px', borderRadius: '50%', background: 'linear-gradient(90deg, #0c4a6e, #0284c7, #075985)', opacity: 0.4 }} />
            </div>

            {/* Glowing AR Bounding Box */}
            <div style={{
              position: 'absolute',
              width: '250px',
              height: '110px',
              borderRadius: '10px',
              border: '2px solid #38bdf8',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.5), inset 0 0 15px rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '12px', height: '12px', borderTop: '3px solid #fff', borderLeft: '3px solid #fff' }} />
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '12px', height: '12px', borderTop: '3px solid #fff', borderRight: '3px solid #fff' }} />
              <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '12px', height: '12px', borderBottom: '3px solid #fff', borderLeft: '3px solid #fff' }} />
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '12px', height: '12px', borderBottom: '3px solid #fff', borderRight: '3px solid #fff' }} />

              {/* Floating Holographic Telemetry Pill */}
              <div style={{
                position: 'absolute',
                top: '-32px',
                left: '6px',
                background: 'rgba(8, 47, 73, 0.95)',
                border: '1px solid #38bdf8',
                padding: '4px 8px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                color: '#bae6fd',
                boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
              }}>
                <div style={{ fontWeight: '800', color: '#38bdf8' }}>&gt; TYPE: HAZARD</div>
                <div>&gt; SEVERITY: HIGH [94%]</div>
              </div>

              {/* Floating GPS Telemetry */}
              <div style={{
                position: 'absolute',
                bottom: '-28px',
                right: '6px',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid #10b981',
                padding: '3px 7px',
                borderRadius: '5px',
                fontFamily: 'monospace',
                fontSize: '0.62rem',
                color: '#6ee7b7'
              }}>
                &gt; GPS: LOGGED (28.6139° N)
              </div>
            </div>

          </div>

          {/* Bottom Telemetry Bar */}
          <div style={{
            background: 'rgba(8, 47, 73, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.72rem',
            fontFamily: 'monospace',
            color: '#e0f2fe',
            zIndex: 10
          }}>
            <span>⚡ Automated YOLOv8 Detection</span>
            <span style={{ color: '#34d399', fontWeight: '800' }}>DISPATCHED TO CREW</span>
          </div>

        </div>

        {/* Center Vertical Divider with VS Badge */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '2px',
          background: 'linear-gradient(180deg, #38bdf8, #fff, #38bdf8)',
          boxShadow: '0 0 15px #38bdf8',
          zIndex: 30
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#090d16',
            border: '2px solid #38bdf8',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: '900',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            VS
          </div>
        </div>

      </div>

      {/* Script & Storyboard Cues */}
      <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f87171', marginBottom: '0.3rem' }}>
            Left Shot Breakdown (0:00 - 0:03)
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
            <strong>Visual:</strong> Frustrated citizen staring at a rain-filled dark pothole. Tedious multi-step form on cluttered screen. Premature "STATUS: RESOLVED" notification triggers while pothole remains untouched.<br/>
            <strong>SFX:</strong> Distant city rain drizzle, low monotone bureaucratic hum (65Hz).
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1rem' }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#38bdf8', marginBottom: '0.3rem' }}>
            Right Shot Breakdown (0:03 - 0:06)
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
            <strong>Visual:</strong> Phone camera points at identical pothole. Instant 1-click trigger. High-tech glowing cyan AR bounding box wraps hazard with live telemetry: <code>&gt; TYPE: HAZARD | &gt; SEVERITY: HIGH | &gt; GPS: LOGGED</code>.<br/>
            <strong>SFX:</strong> Crisp digital camera shutter click, subtle harmonic affirmative chime.
          </p>
        </div>
      </div>

    </div>
  );
}
