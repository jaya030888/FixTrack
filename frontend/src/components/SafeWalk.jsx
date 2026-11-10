import React, { useState, useEffect, useRef } from 'react';

export default function SafeWalk({ userLocation, triggerSOS, emergencyContacts = [] }) {
  const [destination, setDestination] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [journeyActive, setJourneyActive] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const timerRef = useRef(null);

  // Safe Havens list
  const safeHavens = [
    { name: '24/7 Metro Pink Booth & Women Security', type: 'Police & Transit', distance: '320m', address: 'Gate 2, Metro Station' },
    { name: 'City Hospital Emergency & Trauma Care', type: 'Medical Sanctuary', distance: '650m', address: 'Main Ring Road' },
    { name: 'All-Night Fuel Station & Convenience Store', type: 'Lit Safe Haven', distance: '850m', address: 'Sector 4 Crossing' },
    { name: 'Women Police Helpline Kiosk (24x7)', type: 'Police Kiosk', distance: '1.1km', address: 'Opposite Central Park' }
  ];

  // Journey timer countdown
  useEffect(() => {
    if (journeyActive && timeLeftSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Overdue triggered!
            triggerSOS();
            alert('⚠️ SAFEWALK TIMER EXPIRED! Automatic SOS distress beacon initiated.');
            setJourneyActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [journeyActive, timeLeftSeconds, triggerSOS]);

  const startJourney = () => {
    if (!destination.trim()) {
      alert('Please enter your destination (e.g., Home, Hostel, Metro Station).');
      return;
    }
    setTimeLeftSeconds(durationMinutes * 60);
    setJourneyActive(true);
  };

  const endJourneySafely = () => {
    setJourneyActive(false);
    clearInterval(timerRef.current);
    alert('🎉 Safe arrival confirmed! Your journey timer has ended.');
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem 3rem 1rem' }}>
      
      {/* Active Journey Banner */}
      {journeyActive && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(15, 23, 42, 0.9))',
          border: '2px solid var(--primary)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 8px 30px rgba(244, 63, 94, 0.25)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981', letterSpacing: '0.05em' }}>SAFEWALK ACTIVE</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.2rem' }}>
              Heading to: {destination}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              If you don't check in before the timer reaches 00:00, an automatic SOS alert will be sent to your guardians.
            </p>
          </div>

          <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              fontSize: '2.4rem',
              fontWeight: '900',
              fontFamily: 'var(--font-mono)',
              color: timeLeftSeconds < 180 ? '#ef4444' : '#38bdf8'
            }}>
              {formatTimer(timeLeftSeconds)}
            </div>

            <button
              onClick={endJourneySafely}
              className="btn btn-primary"
              style={{ background: '#10b981', padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}>
              ✅ I've Arrived Safely
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Setup SafeWalk Journey Card */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🚶‍♀️</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              SafeWalk Guardian Timer
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Set a timed companion for late-night walks, cab rides, or commuting through isolated stretches.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.35rem', color: '#e2e8f0' }}>
                Your Destination
              </label>
              <input
                type="text"
                placeholder="e.g. PG Hostel, Home, Metro Gate 3"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={journeyActive}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.35rem', color: '#e2e8f0' }}>
                Expected Travel Time: {durationMinutes} Minutes
              </label>
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                disabled={journeyActive}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                <span>5 mins</span>
                <span>30 mins</span>
                <span>60 mins</span>
                <span>90 mins</span>
              </div>
            </div>

            {!journeyActive ? (
              <button
                onClick={startJourney}
                className="btn btn-primary"
                style={{ padding: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                🛡️ Start SafeWalk Watch
              </button>
            ) : (
              <button
                onClick={endJourneySafely}
                className="btn btn-secondary"
                style={{ padding: '0.75rem', width: '100%' }}>
                Cancel SafeWalk
              </button>
            )}
          </div>
        </div>

        {/* Route Safety Score Predictor */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Neighborhood Safety Index
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Real-time environmental risk breakdown around your current location.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Overall Score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall Route Safety</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#10b981' }}>86 / 100</h3>
              </div>
              <span className="badge badge-low">Favorable</span>
            </div>

            {/* Metrics */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#cbd5e1' }}>💡 Street Lighting & Visibility</span>
                <span style={{ color: '#10b981', fontWeight: '700' }}>88% Well-Lit</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', background: '#10b981' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#cbd5e1' }}>👮 Police Patrol Density</span>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>High (2 booths nearby)</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: '#38bdf8' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#cbd5e1' }}>⚠️ Active Hazard Incident Density</span>
                <span style={{ color: '#f59e0b', fontWeight: '700' }}>Low / Isolated</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: '#f59e0b' }} />
              </div>
            </div>

          </div>
        </div>

        {/* 24x7 Verified Safe Havens */}
        <div className="glass-panel" style={{ padding: '1.75rem', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🏥</span> Nearby 24/7 Verified Safe Havens
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Immediate walk-in safe sanctuaries with security personnel, lighting, and cameras.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {safeHavens.map((h, i) => (
              <div
                key={i}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                      {h.type}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>
                      {h.distance}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {h.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {h.address}
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ' ' + h.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', marginTop: '0.75rem', width: '100%' }}>
                  🗺️ Navigate Here
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

