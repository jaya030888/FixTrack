import React from 'react';
import AuthBar from './AuthBar';

const TABS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'incidents', label: 'Live Road Radar', icon: 'radar' },
  { id: 'report', label: 'Report a Hazard', icon: 'add_a_photo' },
  { id: 'safewalk', label: 'Women Safety Hub', icon: 'shield_with_heart', badge: 'Safety' },
  { id: 'research', label: 'Innovation & Research', icon: 'lightbulb' }
];

export default function Navbar({
  activeTab,
  setActiveTab,
  userLocation,
  triggerSOS,
  onRefreshLocation,
  onToggleDiscreet,
  onOpenGuide,
  currentUser,
  onUserChange
}) {
  return (
    <header className="nav-pill">
      {/* Top Deck: Brand Logo & Interactive Utility Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        {/* Brand Identity */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('home')}
          title="FixTrack Home">
          <div style={{
            background: 'linear-gradient(135deg, #ff5a3d, #c9f45a)',
            width: 40,
            height: 40,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px -6px rgba(255,90,61,.7)',
            transition: 'transform 0.25s ease'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#17151a' }}>
              construction
            </span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
                Fix<span style={{ color: 'var(--coral)' }}>Track</span>
              </span>
              <span style={{
                fontSize: '0.6rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em',
                background: '#fff0eb',
                color: 'var(--coral)',
                padding: '2px 7px',
                borderRadius: 999,
                fontWeight: 700
              }}>
                HERHACK 2026
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-55)', fontWeight: 500 }}>
              AI Pothole Radar · Civic Platform
            </div>
          </div>
        </div>

        {/* Right Action Controls Tray */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {/* Quick Guide Trigger */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              style={{
                height: 34,
                padding: '0 0.85rem',
                borderRadius: 999,
                background: '#fff0eb',
                color: 'var(--coral)',
                border: '1px solid rgba(255,90,61,0.28)',
                fontSize: '0.74rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Learn How to Use FixTrack in 5 Easy Steps">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>menu_book</span>
              <span>How It Works</span>
            </button>
          )}

          {/* GPS Location Pill */}
          <div style={{
            height: 34,
            padding: '0 0.75rem',
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid var(--line)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 15, color: userLocation ? '#10b981' : '#f59e0b' }}>
              my_location
            </span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
              {userLocation ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : 'Syncing GPS...'}
            </span>
            <button
              onClick={onRefreshLocation}
              title="Refresh GPS Coordinates"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--ink-55)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                marginLeft: '0.1rem'
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>
            </button>
          </div>

          {/* Discreet Calculator Disguise Mode */}
          <button
            onClick={onToggleDiscreet}
            style={{
              height: 34,
              padding: '0 0.75rem',
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid var(--line)',
              color: 'var(--ink)',
              fontSize: '0.74rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease'
            }}
            title="Calculator Disguise for Covert Protection">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calculate</span>
            <span>Disguise</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={triggerSOS}
            className="animate-pulse-sos"
            style={{
              height: 34,
              padding: '0 1rem',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.45)',
              transition: 'all 0.2s ease'
            }}
            title="Instant High-Urgency Emergency Panic Beacon">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>emergency</span>
            <span>SOS</span>
          </button>

          {/* Integrated User Account Switcher */}
          {currentUser && onUserChange && (
            <AuthBar currentUser={currentUser} onUserChange={onUserChange} />
          )}
        </div>
      </div>

      {/* Bottom Deck: Primary Navigation Tabs & Real-Time Telemetry */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(23, 21, 26, 0.07)',
        flexWrap: 'wrap'
      }}>
        {/* Navigation Tabs Segmented Container */}
        <nav style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'rgba(23, 21, 26, 0.04)',
          padding: '4px',
          borderRadius: 999,
          gap: '4px',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: 999,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: isActive ? '#17151a' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--ink-70)',
                  boxShadow: isActive ? '0 3px 10px rgba(23, 21, 26, 0.18)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 17,
                    color: isActive ? 'var(--lime)' : 'inherit',
                    transition: 'color 0.2s ease'
                  }}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span style={{
                    fontSize: '0.58rem',
                    fontFamily: 'var(--font-mono)',
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(245, 184, 208, 0.45)',
                    color: isActive ? '#ffffff' : '#9d174d',
                    padding: '2px 6px',
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: '0.04em'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Civic Telemetry Badge (Fills the Right Void) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--ink-70)',
          flexWrap: 'wrap'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#ecfdf5',
            color: '#047857',
            padding: '3px 9px',
            borderRadius: 999,
            fontWeight: 600,
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            YOLOv8 Active
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#f0f9ff',
            color: '#0369a1',
            padding: '3px 9px',
            borderRadius: 999,
            fontWeight: 600,
            border: '1px solid rgba(14, 165, 233, 0.2)'
          }}>
            PostGIS 30m
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#fff0eb',
            color: 'var(--coral)',
            padding: '3px 9px',
            borderRadius: 999,
            fontWeight: 600,
            border: '1px solid rgba(255, 90, 61, 0.2)'
          }}>
            Citizen Audits
          </span>
        </div>
      </div>
    </header>
  );
}
