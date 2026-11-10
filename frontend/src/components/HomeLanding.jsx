import React from 'react';

const ShieldBloom = () => (
  <svg className="hero-art" viewBox="0 0 640 160" fill="none" aria-hidden="true">
    <path
      d="M40 120 C120 40, 220 40, 320 90 C420 140, 520 40, 600 70"
      stroke="#ff5a3d"
      strokeWidth="2.2"
      strokeDasharray="10 8"
      style={{ animation: 'dash 8s linear infinite' }}
    />
    <circle cx="320" cy="90" r="10" fill="#a995ff">
      <animate attributeName="r" values="8;14;8" dur="2.4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.45;1" dur="2.4s" repeatCount="indefinite" />
    </circle>
    <circle cx="320" cy="90" r="28" stroke="#c9f45a" strokeWidth="1.5" fill="none">
      <animate attributeName="r" values="20;36;20" dur="2.8s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0.15;0.8" dur="2.8s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export default function HomeLanding({ onOpenMap, onReport, onSafeWalk }) {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div>
          <div className="eyebrow">FixTrack · HerHack 2026 · Faridabad</div>
          <h1>
            SHE WALKS.
            <br />
            <em>What’s next</em>
            <br />
            IS SAFETY.
          </h1>
          <p className="hero-lead">
            A live women-safety and civic incident platform: SOS in one tap, a SafeWalk guardian,
            community radar, and AI that scores risk before help is too late.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onOpenMap}>
              Open live radar →
            </button>
            <button className="btn btn-secondary" onClick={onReport}>
              Report a hazard
            </button>
            <button className="btn btn-outline" onClick={onSafeWalk}>
              Start SafeWalk
            </button>
          </div>
          <div className="hero-meta">
            <span><span className="pulse-dot" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#c9f45a', marginRight: 8, boxShadow: '0 0 0 0 rgba(201,244,90,.7)', animation: 'pulse-sos 2.4s infinite' }} />GPS + PostGIS nearby search</span>
            <span>Discreet calculator SOS</span>
            <span>WhatsApp / 112 handoff</span>
          </div>
        </div>

        <div className="hero-visual">
          <img src="/illustrations/hero-safewalk.jpg" alt="A woman walking a lit safe path with a protective map glow" />
          <span className="float-label is-coral" style={{ top: 18, left: 16 }}>SOS READY</span>
          <span className="float-label is-lime" style={{ top: 72, right: 8, animationDelay: '1.1s' }}>SYSTEM READY</span>
          <span className="float-label is-lavender" style={{ bottom: 84, left: 28, animationDelay: '0.5s' }}>GUARDIAN PING</span>
          <span className="float-label is-pink" style={{ bottom: 36, right: 24, animationDelay: '1.6s' }}>SAFEWALK ON</span>
          <ShieldBloom />
        </div>
      </div>

      <div className="feature-grid">
        <button className="feature-card" onClick={onOpenMap} style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
          <img src="/illustrations/community-radar.jpg" alt="Community safety radar map with incident pins" />
          <h3>Community radar</h3>
          <p>See harassment, dark streets, and verified safe zones around your live GPS — not after you already walked into them.</p>
        </button>
        <button className="feature-card" onClick={onSafeWalk} style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
          <img src="/illustrations/hero-safewalk.jpg" alt="SafeWalk companion path" />
          <h3>SafeWalk guardian</h3>
          <p>A timed companion that watches the route. If you go silent, it can escalate to SOS with coordinates.</p>
        </button>
        <button className="feature-card" onClick={() => onOpenMap()} style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
          <img src="/illustrations/discreet-sos.jpg" alt="Phone disguised as a calculator for covert SOS" />
          <h3>Discreet SOS</h3>
          <p>Looks like a calculator. A PIN still broadcasts a distress beacon — built for the moment you cannot be seen opening a panic app.</p>
        </button>
      </div>
    </section>
  );
}
