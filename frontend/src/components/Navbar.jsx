import React from 'react';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'incidents', label: 'Live radar' },
  { id: 'safewalk', label: 'SafeWalk' },
  { id: 'report', label: 'Report' },
  { id: 'safety', label: 'Tools' },
  { id: 'contacts', label: 'Guardians' },
  { id: 'ai', label: 'AI analyzer' },
  { id: 'ai-suite', label: 'AI suite' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'pitch', label: 'Pitch scene' }
];

export default function Navbar({ activeTab, setActiveTab, userLocation, triggerSOS, onRefreshLocation, onToggleDiscreet }) {
  return (
    <header className="nav-pill">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div style={{
            background: 'linear-gradient(135deg, #ff5a3d, #f5b8d0)',
            width: 42,
            height: 42,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px -10px rgba(255,90,61,.9)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#220c05" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.04em' }}>
                Fix<span style={{ color: 'var(--coral)' }}>Track</span>
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.14em',
                background: '#fff0eb',
                color: 'var(--coral)',
                padding: '3px 8px',
                borderRadius: 999,
                fontWeight: 700
              }}>
                HERHACK
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-55)' }}>
              She builds what’s next — safer streets
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
          <div style={{
            background: 'var(--cream)',
            padding: '0.4rem 0.8rem',
            borderRadius: 999,
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: userLocation ? '#84cc16' : '#f59e0b', display: 'inline-block' }} />
            <span>
              {userLocation ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : 'GPS acquiring...'}
            </span>
            <button
              onClick={onRefreshLocation}
              title="Update GPS Location"
              style={{ background: 'transparent', border: 'none', color: 'var(--ink-55)', cursor: 'pointer' }}>
              ↻
            </button>
          </div>

          <button
            onClick={onToggleDiscreet}
            className="btn btn-secondary"
            title="Switch to Innocent Calculator Disguise"
            style={{ fontSize: '0.68rem', padding: '0.5rem 0.85rem' }}>
            Disguise
          </button>

          <button
            onClick={triggerSOS}
            className="btn btn-danger animate-pulse-sos"
            style={{ padding: '0.5rem 1rem', fontSize: '0.72rem' }}>
            SOS
          </button>
        </div>
      </div>

      <nav className="nav-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab${activeTab === tab.id ? ' is-active' : ''}`}>
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
