import React, { useState } from 'react';

export default function HomeLanding({ onOpenMap, onReport, onSafeWalk, onOpenGuide }) {
  const [activeBeforeAfter, setActiveBeforeAfter] = useState('before');

  return (
    <section className="hero" style={{ padding: '2rem 1.5rem 5rem 1.5rem', maxWidth: '1320px', margin: '0 auto' }}>
      {/* Official HerHack 2026 Marquee Ticker */}
      <div className="marquee" role="marquee" style={{ marginBottom: '3rem', background: 'var(--dark)', color: '#fff', padding: '0.9rem 0', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="marquee__track">
          <span className="marquee__item">YOLOv8 Edge Neural Vision Active</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          <span className="marquee__item">Critical Pothole Flagged Sector 14</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          <span className="marquee__item">Closed-Loop Verification: 18 Citizen Votes</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          <span className="marquee__item">PostGIS 30m Auto-Deduplication</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          <span className="marquee__item">Pink Patrol Safe Corridor Active</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          <span className="marquee__item">Bitumen Patch Sealed &amp; Verified</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          {/* Duplicate track for seamless infinite scroll */}
          <span className="marquee__item">YOLOv8 Edge Neural Vision Active</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          <span className="marquee__item">Critical Pothole Flagged Sector 14</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          <span className="marquee__item">Closed-Loop Verification: 18 Citizen Votes</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          <span className="marquee__item">PostGIS 30m Auto-Deduplication</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          <span className="marquee__item">Pink Patrol Safe Corridor Active</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
          <span className="marquee__item">Bitumen Patch Sealed &amp; Verified</span>
          <span className="marquee__star" aria-hidden="true">✦</span>
        </div>
      </div>

      {/* Main Hero Grid */}
      <div className="hero-grid" style={{ alignItems: 'center', gap: 'clamp(32px, 5vw, 64px)' }}>
        <div>
          <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="pulse-dot" />
            <span>FIXTRACK · HERHACK 2026 · FARIDABAD</span>
          </div>

          <h1 className="hero__title" style={{ marginTop: '0.85rem', marginBottom: '1.4rem' }}>
            <span className="hero__line">SHE BUILDS</span>
            <span className="hero__line hero__line--alt">SMART ROADS.</span>
            <span className="hero__line">
              <em>Every pothole</em> VERIFIED.
            </span>
          </h1>

          <p className="hero__sub" style={{ marginBottom: '2.4rem', fontSize: '1.15rem', lineHeight: 1.6 }}>
            A citizen-powered road intelligence platform: Snap potholes and hazards with your phone, let YOLOv8 classify depth and severity in under 1.2s, and hold municipal crews accountable through community before/after verification audits.
          </p>

          <div className="hero-actions" style={{ display: 'flex', gap: '0.95rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button className="btn btn-primary" onClick={onReport} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', padding: '14px 24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>photo_camera</span>
              <span>Report a Pothole</span>
              <span className="btn__arrow">→</span>
            </button>
            <button className="btn btn-secondary" onClick={onOpenMap} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', padding: '14px 22px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>radar</span>
              <span>Live Road Radar</span>
            </button>
            <button className="btn btn-outline" onClick={onSafeWalk} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', padding: '14px 20px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ff5a3d' }}>alt_route</span>
              <span>Safe Corridors</span>
            </button>
            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                style={{
                  background: '#fff0eb',
                  color: 'var(--coral)',
                  border: '1.5px solid rgba(255,90,61,0.3)',
                  padding: '14px 20px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.25s ease'
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>menu_book</span>
                <span>Simple User Guide</span>
              </button>
            )}
          </div>

          <div className="hero-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--ink-70)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'var(--coral)' }}>check_circle</span>
              YOLOv8 Edge Neural Inference
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#10b981' }}>map</span>
              PostGIS 30m Auto-Deduplication
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'var(--lavender)' }}>how_to_reg</span>
              Civic Consensus Proof-of-Repair
            </span>
          </div>
        </div>

        {/* Live Interactive YOLOv8 Scanner Display with Official HerHack Floating Labels */}
        <div style={{ position: 'relative' }}>
          <div className="scanner-viewport">
            <div className="scanner-grid" />
            <div className="scanner-laser-bar" />

            {/* Stylized Pothole Graphic */}
            <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
              <line x1="200" y1="0" x2="200" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="4" strokeDasharray="16 16" />
              <path
                d="M 120 160 Q 150 130 190 145 T 250 160 Q 280 190 260 220 T 180 235 Q 130 220 120 160 Z"
                fill="rgba(15, 12, 18, 0.95)"
                stroke="rgba(255, 90, 61, 0.7)"
                strokeWidth="2"
              />
              <path
                d="M 140 170 Q 165 150 200 160 T 235 180 Q 245 205 220 215 T 160 210 Z"
                fill="#0a080c"
              />
            </svg>

            {/* Real-time YOLO Bounding Box */}
            <div
              className="ai-bounding-box"
              style={{
                top: '38%',
                left: '26%',
                width: '46%',
                height: '42%'
              }}
            >
              <div className="ai-tag-pill">
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>smart_toy</span>
                pothole: 94.8% (Severe)
              </div>
              <div style={{
                position: 'absolute',
                bottom: 6,
                right: 8,
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--lime)',
                background: 'rgba(0,0,0,0.65)',
                padding: '2px 6px',
                borderRadius: 4
              }}>
                Area: 0.38 m² | Depth: ~5.8 cm
              </div>
            </div>

            {/* Telemetry Header */}
            <div style={{
              position: 'absolute',
              top: 14,
              left: 16,
              right: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 15
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse-ring 2s infinite' }} />
                LIVE YOLOv8 ROAD SCANNER
              </div>

              <div style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--lime)',
                background: 'rgba(0,0,0,0.7)',
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid rgba(201, 244, 90, 0.3)'
              }}>
                FPS: 48.2 · LAT: 1.1s
              </div>
            </div>

            {/* Official HerHack Floating Animated Badges */}
            <span className="float-label is-coral" style={{ top: 70, left: 18 }}>
              <span className="pulse-dot" style={{ background: 'var(--coral)', width: 6, height: 6 }} />
              SEVERITY: CRITICAL
            </span>
            <span className="float-label is-lime" style={{ bottom: 20, left: 20, animationDelay: '1.2s' }}>
              <span className="pulse-dot" style={{ background: '#1c2405', width: 6, height: 6 }} />
              AUTO-ASSIGNED WARD 14
            </span>
            <span className="float-label is-lavender" style={{ top: 76, right: 18, animationDelay: '0.7s' }}>
              POSTGIS: 28.6139° N, 77.2090° E
            </span>
            <span className="float-label is-pink" style={{ bottom: 30, right: 24, animationDelay: '1.9s' }}>
              CITIZEN AUDIT READY
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.75rem',
            padding: '0 0.5rem',
            fontSize: '0.75rem',
            color: 'var(--ink-55)',
            fontFamily: 'var(--font-mono)'
          }}>
            <span>MODEL: YOLOv8-pothole-v3 (best.pt)</span>
            <span>DATASET: 4,800 Annotated Cracks</span>
          </div>
        </div>
      </div>

      {/* Key Metric Highlights Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
        marginTop: '3.5rem',
        marginBottom: '4rem'
      }}>
        <div className="metric-card-styled">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--coral)' }}>report_problem</span>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-55)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 999 }}>LIVE FEED</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1 }}>2,480+</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '0.35rem' }}>Potholes Detected</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-55)', marginTop: '0.2rem' }}>Geolocated across Delhi NCR road networks</p>
        </div>

        <div className="metric-card-styled">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#10b981' }}>verified</span>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-55)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 999 }}>ACCURACY</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1 }}>94.8%</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '0.35rem' }}>YOLOv8 Precision</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-55)', marginTop: '0.2rem' }}>Trained on deep potholes and asphalt fractures</p>
        </div>

        <div className="metric-card-styled">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--lavender)' }}>speed</span>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-55)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 999 }}>INFERENCE</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1 }}>&lt; 1.2s</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '0.35rem' }}>Real-Time Inference</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-55)', marginTop: '0.2rem' }}>Instant classification directly from device camera</p>
        </div>

        <div className="metric-card-styled">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#f59e0b' }}>task_alt</span>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-55)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 999 }}>CITIZEN AUDIT</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1 }}>89.2%</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '0.35rem' }}>Verified Fix Rate</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-55)', marginTop: '0.2rem' }}>Tickets closed only after community before/after vote</p>
        </div>
      </div>

      {/* 3-Step Civic Pipeline */}
      <div style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 2.5rem' }}>
          <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--coral)' }}>account_tree</span>
            HOW FIXTRACK OPERATES
          </div>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
            From Dangerous Crater to Verified Pavement
          </h2>
          <p style={{ color: 'var(--ink-70)', fontSize: '0.95rem' }}>
            A transparent closed-loop accountability engine connecting citizens, neural vision, and municipal crews.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="pipeline-step-card">
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: '#fff0eb',
              color: 'var(--coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26 }}>add_a_photo</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--coral)', fontWeight: 700, marginBottom: '0.3rem' }}>
              STEP 01
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Snap & Auto-Deduplicate</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-70)', lineHeight: 1.6 }}>
              A citizen photographs a pothole. PostGIS reads embedded EXIF coordinates and clusters complaints within a 30-meter radius, consolidating duplicate citizen reports into a single high-priority municipal ticket.
            </p>
          </div>

          <div className="pipeline-step-card">
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: '#eff6ff',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26 }}>psychology</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#3b82f6', fontWeight: 700, marginBottom: '0.3rem' }}>
              STEP 02
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>YOLOv8 Severity Scoring</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-70)', lineHeight: 1.6 }}>
              Our custom-trained YOLOv8 neural network detects the crater boundaries, calculates surface square-meters, determines depth hazard grade (Grade 1 to 4), and automatically assigns SLA urgency.
            </p>
          </div>

          <div className="pipeline-step-card">
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26 }}>how_to_vote</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 700, marginBottom: '0.3rem' }}>
              STEP 03
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Closed-Loop Citizen Verification</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-70)', lineHeight: 1.6 }}>
              Authorities cannot self-certify completion. When road crews submit after-photos, nearby citizens receive a push ping to vote: <strong>Fixed 👍</strong> or <strong>Still Broken 👎</strong>. Citizens earn +15 Civic Karma Points per audit.
            </p>
          </div>
        </div>
      </div>

      {/* Closed-Loop Proof of Repair Showcase */}
      <div className="resolution-audit-card" style={{ padding: '2.5rem', marginBottom: '4rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
              CLOSED-LOOP AUDIT SYSTEM
            </div>
            <h3 style={{ fontSize: '1.5rem', marginTop: '0.35rem' }}>
              Before & After Defect Resolution Verification
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-55)', marginTop: '0.2rem' }}>
              Incident #FX-2026-089 · Sector 15 Faridabad Junction · Resolved in 48 Hours
            </p>
          </div>

          <div style={{ display: 'inline-flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 999, border: '1px solid var(--line)' }}>
            <button
              onClick={() => setActiveBeforeAfter('before')}
              style={{
                background: activeBeforeAfter === 'before' ? 'var(--coral)' : 'transparent',
                color: activeBeforeAfter === 'before' ? '#ffffff' : 'var(--ink)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: 999,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>warning</span>
              Citizen Report (Before)
            </button>
            <button
              onClick={() => setActiveBeforeAfter('after')}
              style={{
                background: activeBeforeAfter === 'after' ? '#10b981' : 'transparent',
                color: activeBeforeAfter === 'after' ? '#ffffff' : 'var(--ink)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: 999,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
              PWD Repaired (After)
            </button>
          </div>
        </div>

        {/* Visual Inspection Viewport */}
        <div style={{
          position: 'relative',
          height: 260,
          borderRadius: 16,
          overflow: 'hidden',
          background: activeBeforeAfter === 'before' 
            ? 'linear-gradient(135deg, #24171a 0%, #17151a 100%)' 
            : 'linear-gradient(135deg, #11251e 0%, #101915 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--line)'
        }}>
          {activeBeforeAfter === 'before' ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{
                width: 90,
                height: 55,
                margin: '0 auto 1rem',
                borderRadius: '50%',
                background: '#0d0b0f',
                border: '2px dashed var(--coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(255, 90, 61, 0.4)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--coral)' }}>warning</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Deep Asphalt Cavity Reported</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                GPS: 28.6139° N, 77.2090° E · AI Confidence: 94.8% · Status: WORK ORDER ISSUED
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{
                width: 70,
                height: 70,
                margin: '0 auto 1rem',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#10b981' }}>check</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Fresh Bitumen Patch Sealed &amp; Compacted</div>
              <div style={{ fontSize: '0.8rem', color: '#c9f45a', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                18 Nearby Citizens Voted "Fixed 👍" · Ticket Closed Automatically
              </div>
            </div>
          )}
        </div>
      </div>

      {/* High-Impact Highlight for Women's Safety & Safe Transit (Tastefully highlighted, not dominating hero) */}
      <div className="women-safe-banner">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(245, 184, 208, 0.15)',
              color: '#f5b8d0',
              padding: '4px 12px',
              borderRadius: 999,
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '1rem'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>shield_with_heart</span>
              WOMEN'S TRANSIT CORRIDOR INTELLIGENCE
            </div>

            <h3 style={{ fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.85rem' }}>
              Because Road Safety Is Also Personal Safety.
            </h3>

            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              Dark, damaged, waterlogged streets create secluded hazard zones. FixTrack includes a dedicated <strong>Safe Corridor Routing Engine</strong> that dynamically routes women away from poorly lit roads and unpaved hazards toward well-lit, Pink-Patrol monitored arterial avenues.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={onSafeWalk}
                style={{
                  background: '#f5b8d0',
                  color: '#2a1625',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 700
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>directions_walk</span>
                <span>Launch SafeWalk Companion</span>
              </button>
              <button
                className="btn btn-outline"
                onClick={onOpenMap}
                style={{
                  color: '#ffffff',
                  borderColor: 'rgba(255,255,255,0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>alt_route</span>
                <span>View Safe Corridors on Map</span>
              </button>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#f5b8d0', fontWeight: 700, marginBottom: '1rem' }}>
              SAFETY CORRIDOR FEATURES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--lime)', marginTop: 2 }}>lightbulb</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>100% Illumination Scoring</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>Routes prioritize working streetlights and open commercial shops</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#f5b8d0', marginTop: 2 }}>local_police</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Pink Police Booth Geofence</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>Direct transit through active police kiosks &amp; metro safety gates</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--coral)', marginTop: 2 }}>calculate</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Discreet Calculator Mode</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>Innocent working calculator that broadcasts SOS when PIN is entered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
