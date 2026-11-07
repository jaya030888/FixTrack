import React from 'react';

export default function Navbar({ activeTab, setActiveTab, userLocation, triggerSOS, onRefreshLocation }) {
  return (
    <header className="glass-panel" style={{ margin: '1rem', padding: '0.85rem 1.5rem', position: 'sticky', top: '1rem', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('incidents')}>
          <div style={{
            background: 'linear-gradient(135deg, #f43f5e, #be123c)',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.4)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
                Fix<span style={{ color: 'var(--primary)' }}>Track</span>
              </span>
              <span style={{ fontSize: '0.65rem', background: 'rgba(244, 63, 94, 0.2)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                HERHACK
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Women's Safety & Incident Response
            </div>
          </div>
        </div>

        {/* Location & Branch Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: userLocation ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
            <span style={{ color: 'var(--text-muted)' }}>
              {userLocation ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : 'GPS acquiring...'}
            </span>
            <button 
              onClick={onRefreshLocation}
              title="Update GPS Location"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </button>
          </div>

          <div style={{
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.72rem'
          }}>
            🌿 Chandani
          </div>

          {/* Instant SOS button in header */}
          <button 
            onClick={triggerSOS}
            className="btn btn-danger animate-pulse-sos"
            style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', borderRadius: '20px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            SOS TRIGGER
          </button>
        </div>

      </div>

      {/* Navigation Tabs */}
      <nav style={{
        display: 'flex',
        gap: '0.4rem',
        marginTop: '0.85rem',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '0.75rem',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {[
          { id: 'incidents', label: 'Incident Radar & Map', icon: '🚨' },
          { id: 'report', label: 'Report Incident', icon: '📢' },
          { id: 'safety', label: 'Safety Tools & Siren', icon: '🛡️' },
          { id: 'contacts', label: 'Emergency Contacts', icon: '👥' },
          { id: 'ai', label: 'AI Threat Analyzer', icon: '🧠' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: activeTab === tab.id ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}

