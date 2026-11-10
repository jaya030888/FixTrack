import React from 'react';

const TABS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'incidents', label: 'Live Road Radar', icon: 'radar' },
  { id: 'report', label: 'Report a Hazard', icon: 'add_a_photo' },
  { id: 'safewalk', label: 'Women Safety Hub', icon: 'shield_with_heart', badge: 'Safety' },
  { id: 'research', label: 'Innovation & Research', icon: 'lightbulb' }
];

export default function Navbar({ activeTab, setActiveTab, userLocation, triggerSOS, onRefreshLocation, onToggleDiscreet, onOpenGuide }) {
  return (
    <header className="nav-pill" style={{ padding: '0.85rem 1.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div style={{
            background: 'linear-gradient(135deg, #ff5a3d, #c9f45a)',
            width: 46,
            height: 46,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px -8px rgba(255,90,61,.7)',
            transition: 'transform 0.25s ease'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 26, color: '#17151a' }}>
              construction
            </span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.04em' }}>
                Fix<span style={{ color: 'var(--coral)' }}>Track</span>
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.12em',
                background: '#fff0eb',
                color: 'var(--coral)',
                padding: '3px 8px',
                borderRadius: 999,
                fontWeight: 700
              }}>
                HERHACK 2026
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--ink-55)', fontWeight: 500 }}>
              AI Pothole Radar &amp; Civic Infrastructure Platform
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
          {/* Quick Guide Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="btn btn-secondary"
              style={{
                fontSize: '0.74rem',
                padding: '0.45rem 0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#fff0eb',
                color: 'var(--coral)',
                borderColor: 'rgba(255,90,61,0.3)',
                fontWeight: 700
              }}
              title="Learn How to Use FixTrack in 4 Easy Steps">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>menu_book</span>
              <span>How It Works</span>
            </button>
          )}

          <div style={{
            background: 'var(--cream)',
            padding: '0.42rem 0.85rem',
            borderRadius: 999,
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: userLocation ? '#10b981' : '#f59e0b' }}>
              my_location
            </span>
            <span style={{ fontWeight: 600 }}>
              {userLocation ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : 'Syncing GPS...'}
            </span>
            <button
              onClick={onRefreshLocation}
              title="Refresh GPS Coordinates"
              style={{ background: 'transparent', border: 'none', color: 'var(--ink-55)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
            </button>
          </div>

          <button
            onClick={onToggleDiscreet}
            className="btn btn-secondary"
            title="Calculator Disguise for Emergency Protection"
            style={{ fontSize: '0.72rem', padding: '0.5rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calculate</span>
            <span>Disguise</span>
          </button>

          <button
            onClick={triggerSOS}
            className="btn btn-danger animate-pulse-sos"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>emergency</span>
            <span>SOS</span>
          </button>
        </div>
      </div>

      <nav className="nav-tabs" style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab${activeTab === tab.id ? ' is-active' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              borderRadius: 999,
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === tab.id ? '1px solid rgba(23, 21, 26, 0.9)' : '1px solid var(--line)',
              background: activeTab === tab.id ? 'var(--ink)' : 'var(--cream)',
              color: activeTab === tab.id ? '#ffffff' : 'var(--ink-70)',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(23, 21, 26, 0.2)' : 'none'
            }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: activeTab === tab.id ? 'var(--lime)' : 'inherit' }}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span style={{
                fontSize: '0.6rem',
                fontFamily: 'var(--font-mono)',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(245, 184, 208, 0.35)',
                color: activeTab === tab.id ? '#ffffff' : '#ab3360',
                padding: '2px 7px',
                borderRadius: 999,
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </header>
  );
}
