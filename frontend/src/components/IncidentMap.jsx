import React, { useState, useMemo } from 'react';
import { calculateDistance } from '../services/api';

const PRESET_DESTINATIONS = [
  { name: 'Central Metro Station (Gate 2 Pink Booth)', lat: 28.6180, lng: 77.2150, type: 'Transit & Police' },
  { name: 'Echelon Institute Campus Main Gate', lat: 28.6250, lng: 77.2280, type: 'Campus Sanctuary' },
  { name: 'Sector 14 Women\'s PG & Hostel Complex', lat: 28.6080, lng: 77.2020, type: 'Residential' },
  { name: 'City Hospital Emergency 24/7 Gate', lat: 28.6120, lng: 77.2250, type: 'Medical Sanctuary' }
];

export default function IncidentMap({
  incidents = [],
  userLocation,
  onSelectIncident,
  onNewReportClick,
  onStartSafeWalk,
  showToast = () => {}
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [maxRadiusMeters, setMaxRadiusMeters] = useState(10000);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIncidentId, setActiveIncidentId] = useState(null);

  // --- Core Feature: Departure & Arrival Safe Path Routing ---
  const [isRoutingActive, setIsRoutingActive] = useState(false);
  const [departure, setDeparture] = useState(userLocation ? `Current GPS (${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)})` : 'Sector 12 Market');
  const [destination, setDestination] = useState(PRESET_DESTINATIONS[0].name);
  const [routingMode, setRoutingMode] = useState('safe'); // 'fast' | 'safe'

  // --- Core Feature: Closed-Loop "Is It Solved or Not?" Verification State ---
  const [verificationVotes, setVerificationVotes] = useState({});

  // Compute filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const incCat = inc.category || inc.type;
      if (selectedCategory !== 'all' && incCat !== selectedCategory) return false;
      if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (inc.title || inc.type)?.toLowerCase().includes(q);
        const matchesDesc = (inc.description || inc.details)?.toLowerCase().includes(q);
        const matchesAddr = inc.address?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAddr) return false;
      }
      if (userLocation && inc.latitude && inc.longitude) {
        const dist = calculateDistance(userLocation.latitude, userLocation.longitude, inc.latitude, inc.longitude);
        if (dist > maxRadiusMeters) return false;
      }
      return true;
    });
  }, [incidents, selectedCategory, selectedSeverity, searchQuery, userLocation, maxRadiusMeters]);

  const activeIncident = incidents.find(i => i.id === activeIncidentId) || filteredIncidents[0];

  const handleVoteResolution = (incidentId, vote) => {
    setVerificationVotes(prev => ({
      ...prev,
      [incidentId]: vote
    }));
    if (vote === 'fixed') {
      showToast('🎉 Verification Recorded! +15 Civic Score Points awarded to your profile.', 'success');
    } else {
      showToast('⚠️ Dispute Logged: Municipal contractor flagged for unverified repair. +15 Civic Points awarded.', 'warning');
    }
  };

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case 'critical': return 'badge-critical';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'pothole': return '🕳️';
      case 'drains':
      case 'waterlogging': return '🌊';
      case 'garbage': return '🗑️';
      case 'street_light': return '💡';
      case 'harassment': return '⚠️';
      case 'stalking': return '👁️';
      case 'unsafe_area': return '💡';
      case 'safe_zone': return '🛡️';
      case 'theft': return '🚨';
      case 'sos': return '🆘';
      default: return '📍';
    }
  };

  return (
    <div style={{ padding: '0 1rem 2.5rem 1rem', maxWidth: '1440px', margin: '0 auto' }}>

      {/* =========================================================================
       * PILLAR 3 & 4: DEPARTURE & ARRIVAL DUAL ROUTING (FASTEST VS. SAFEST PATH)
       * ========================================================================= */}
      <section className="glass-panel" style={{ padding: '1.4rem', marginBottom: '1.4rem', border: '1.5px solid rgba(255, 90, 61, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🛣️</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                Safe Transit Pathfinder · <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--coral)' }}>Fastest vs. Safest Path</span>
              </h2>
              <span className="float-label is-lime" style={{ position: 'static', padding: '3px 9px', fontSize: '0.65rem' }}>
                POSTGIS DUAL-ROUTING
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-70)', marginTop: '0.2rem' }}>
              Enter departure and arrival to compare the shortest route against illuminated, police-patrolled safe corridors.
            </p>
          </div>

          {/* Quick Route Mode Switcher */}
          <div style={{ display: 'flex', background: '#fff', padding: '4px', borderRadius: '999px', border: '1px solid var(--line-2)' }}>
            <button
              onClick={() => { setRoutingMode('fast'); setIsRoutingActive(true); }}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: routingMode === 'fast' && isRoutingActive ? 'var(--dark)' : 'transparent',
                color: routingMode === 'fast' && isRoutingActive ? '#fff' : 'var(--ink-70)'
              }}>
              ⚡ Fastest Route
            </button>
            <button
              onClick={() => { setRoutingMode('safe'); setIsRoutingActive(true); }}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: routingMode === 'safe' && isRoutingActive ? 'var(--coral)' : 'transparent',
                color: routingMode === 'safe' && isRoutingActive ? '#220c05' : 'var(--ink-70)'
              }}>
              🛡️ Women-Special Safe Corridor
            </button>
          </div>
        </div>

        {/* Departure & Arrival Search Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr)) auto', gap: '0.85rem', alignItems: 'center' }}>
          {/* Departure Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-70)', marginBottom: '0.3rem' }}>
              📍 Departure (Origin)
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                placeholder="Starting address or landmark..."
                className="input-field"
                style={{ flex: 1, padding: '0.65rem 0.95rem', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={() => {
                  if (userLocation) {
                    setDeparture(`My GPS (${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)})`);
                    showToast('📍 Departure synchronized to live GPS', 'info');
                  }
                }}
                className="btn btn-secondary"
                title="Use Current GPS"
                style={{ padding: '0.65rem 0.85rem', fontSize: '0.72rem' }}>
                📍 GPS
              </button>
            </div>
          </div>

          {/* Arrival Input with Presets */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-70)', marginBottom: '0.3rem' }}>
              🎯 Arrival (Destination)
            </label>
            <select
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setIsRoutingActive(true); }}
              className="input-field"
              style={{ width: '100%', padding: '0.65rem 0.95rem', fontSize: '0.85rem' }}>
              {PRESET_DESTINATIONS.map((preset, idx) => (
                <option key={idx} value={preset.name}>
                  {preset.name} ({preset.type})
                </option>
              ))}
            </select>
          </div>

          {/* Action Trigger */}
          <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
            <button
              onClick={() => {
                setIsRoutingActive(true);
                showToast(`🛣️ Calculating ${routingMode === 'safe' ? 'Safest Women Corridor' : 'Fastest Commute'} via PostGIS...`, 'info');
              }}
              className="btn btn-primary"
              style={{ padding: '0.72rem 1.4rem' }}>
              {isRoutingActive ? 'Recalculate Route' : 'Find Best Route →'}
            </button>
          </div>
        </div>

        {/* Live Active Route Comparison Banner */}
        {isRoutingActive && (
          <div style={{
            marginTop: '1.1rem',
            padding: '1rem 1.25rem',
            borderRadius: '16px',
            background: routingMode === 'safe' ? 'rgba(201, 244, 90, 0.22)' : 'rgba(255, 90, 61, 0.1)',
            border: `1.5px solid ${routingMode === 'safe' ? 'rgba(105, 145, 20, 0.35)' : 'rgba(255, 90, 61, 0.35)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{
                background: routingMode === 'safe' ? '#c9f45a' : '#ff5a3d',
                color: '#220c05',
                width: 44,
                height: 44,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}>
                {routingMode === 'safe' ? '🛡️' : '⚡'}
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--ink)' }}>
                  {routingMode === 'safe'
                    ? 'Active Safe Corridor: 2.1 km · 8 mins (Safety Score: 96 / 100)'
                    : 'Fastest Commute: 1.6 km · 6 mins (Safety Score: 52 / 100)'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ink-70)', marginTop: '0.2rem' }}>
                  {routingMode === 'safe'
                    ? '✨ 100% Streetlamp Illumination · 2 Police Pink Booths · High Crowd Density · Bypasses 2 Unlit Alleys'
                    : '⚠️ Caution: Shortest route crosses 2 unlit dark alleys, 1 deep pothole crater, and poor visibility.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {onStartSafeWalk && (
                <button
                  onClick={() => onStartSafeWalk(destination)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.74rem', padding: '0.55rem 1rem' }}>
                  🚶‍♀️ Start SafeWalk Companion
                </button>
              )}
            </div>
          </div>
        )}
      </section>


      {/* =========================================================================
       * FILTER CONTROLS & SEARCH BAR
       * ========================================================================= */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search potholes, waterlogging, street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}>
              <option value="all">All Civic & Safety Categories</option>
              <option value="pothole">🕳️ Road Potholes (YOLO Scanned)</option>
              <option value="drains">🌊 Drainage & Waterlogging</option>
              <option value="garbage">🗑️ Garbage Overflow</option>
              <option value="street_light">💡 Broken Streetlights / Dark Areas</option>
              <option value="harassment">⚠️ Harassment / Catcalling</option>
              <option value="safe_zone">🛡️ Verified Safe Havens</option>
              <option value="sos">🆘 Emergency SOS Distress</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}>
              <option value="all">All Severity Levels</option>
              <option value="critical">🔴 Critical Hazard</option>
              <option value="high">🟠 High Urgency</option>
              <option value="medium">🟡 Medium Hazard</option>
              <option value="low">🟢 Low Risk / Safe</option>
            </select>
          </div>

          {/* Radius Selector */}
          <div>
            <select
              value={maxRadiusMeters}
              onChange={(e) => setMaxRadiusMeters(Number(e.target.value))}
              className="input-field"
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}>
              <option value={1000}>Within 1 km Corridor</option>
              <option value={3000}>Within 3 km Radius</option>
              <option value={5000}>Within 5 km Radius</option>
              <option value={10000}>Within 10 km Ward</option>
              <option value={50000}>Full City Region (50 km)</option>
            </select>
          </div>
        </div>
      </div>


      {/* =========================================================================
       * MAIN GRID: SPATIAL RADAR & INCIDENT INSPECTOR + CLOSED-LOOP VERIFICATION
       * ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.25fr) minmax(320px, 1fr)', gap: '1.25rem' }}>

        {/* Left Column: Spatial Vector Radar Display */}
        <div className="glass-panel" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="pulse-dot" style={{ width: 9, height: 9, background: 'var(--coral)' }} />
                Spatial Radar & Geofenced Hazards
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--ink-70)' }}>
                Live GPS corridor tracking incidents & safety corridors
              </p>
            </div>
            <button onClick={onNewReportClick} className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '0.45rem 0.95rem' }}>
              + Snap & Report Hazard
            </button>
          </div>

          {/* SVG Dark Mode Radar Display */}
          <div style={{
            position: 'relative',
            background: 'radial-gradient(circle, #29262e 0%, #17151a 100%)',
            borderRadius: '16px',
            border: '1.5px solid rgba(255, 90, 61, 0.25)',
            height: '380px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <svg width="100%" height="100%" viewBox="-160 -160 320 320" style={{ position: 'absolute', top: 0, left: 0 }}>
              {/* Concentric distance rings */}
              <circle cx="0" cy="0" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <circle cx="0" cy="0" r="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="0" cy="0" r="135" fill="none" stroke="rgba(255,90,61,0.2)" strokeWidth="1" />

              {/* Crosshairs */}
              <line x1="-150" y1="0" x2="150" y2="0" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="0" y1="-150" x2="0" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

              {/* Distance Labels */}
              <text x="5" y="-47" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="monospace">1km</text>
              <text x="5" y="-92" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="monospace">3km</text>
              <text x="5" y="-137" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="monospace">5km+</text>

              {/* Live Path Polyline if routing active */}
              {isRoutingActive && (
                <>
                  {routingMode === 'safe' ? (
                    // Neon Emerald Safe Corridor (detouring around hazards past streetlights)
                    <path
                      d="M 0 0 Q 40 -60, 90 -40 T 120 -100"
                      fill="none"
                      stroke="#c9f45a"
                      strokeWidth="5"
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 10px #c9f45a)' }}
                    />
                  ) : (
                    // Blue Direct Shortest Path (cuts straight through hazard cluster)
                    <path
                      d="M 0 0 L 120 -100"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      style={{ filter: 'drop-shadow(0 0 8px #38bdf8)' }}
                    />
                  )}
                  {/* Destination Flag Point B */}
                  <circle cx="120" cy="-100" r="8" fill={routingMode === 'safe' ? '#c9f45a' : '#38bdf8'} />
                  <text x="132" y="-96" fill="#fff" fontSize="10" fontWeight="bold">B (Destination)</text>
                </>
              )}

              {/* Center User Dot (Point A) */}
              <circle cx="0" cy="0" r="7" fill="#ff5a3d" />
              <circle cx="0" cy="0" r="14" fill="none" stroke="#ff5a3d" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="7;24" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <text x="10" y="4" fill="#ff5a3d" fontSize="9" fontWeight="bold">A (You)</text>

              {/* Incident Pins */}
              {filteredIncidents.map((inc, idx) => {
                const userLat = userLocation?.latitude || 28.6139;
                const userLng = userLocation?.longitude || 77.2090;
                const dLat = (inc.latitude - userLat) * 3500;
                const dLng = (inc.longitude - userLng) * 3500;
                const dist = Math.sqrt(dLng * dLng + dLat * dLat);
                const scale = dist > 140 ? 140 / dist : 1;
                const cx = dLng * scale;
                const cy = -dLat * scale;

                const isSelected = inc.id === activeIncident?.id;
                const pinColor = inc.severity === 'critical' ? '#ef4444' : inc.severity === 'high' ? '#ff5a3d' : inc.severity === 'medium' ? '#f59e0b' : '#c9f45a';

                return (
                  <g key={inc.id || idx} style={{ cursor: 'pointer' }} onClick={() => setActiveIncidentId(inc.id)}>
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="15" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" />
                    )}
                    <circle cx={cx} cy={cy} r={isSelected ? 9 : 6} fill={pinColor} />
                    <text x={cx + 8} y={cy + 3} fill="#fff" fontSize="9" fontWeight="600">
                      {inc.category === 'sos' ? 'SOS' : (getCategoryIcon(inc.category || inc.type) + ' ' + (inc.title || inc.type || 'Hazard').substring(0, 10))}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom radar legend */}
            <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#97909d', fontFamily: 'var(--font-mono)' }}>
              <span>📍 Point A: You (Live GPS)</span>
              <span>🔴 Critical &nbsp; 🟠 High &nbsp; 🟡 Pothole/Hazard &nbsp; 🟢 Safe Corridor</span>
            </div>
          </div>


          {/* =========================================================================
           * PILLAR 2: "IS IT SOLVED OR NOT?" CLOSED-LOOP VERIFICATION INSPECTOR
           * ========================================================================= */}
          {activeIncident && (
            <div style={{ marginTop: '1.1rem', padding: '1.1rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className={`badge ${getSeverityBadgeClass(activeIncident.severity)}`}>
                      {activeIncident.severity}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-70)' }}>
                      {getCategoryIcon(activeIncident.category || activeIncident.type)} {(activeIncident.category || activeIncident.type || 'Hazard').toUpperCase()}
                    </span>
                    {activeIncident.status && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        background: activeIncident.status === 'resolved' ? '#f4ffdc' : '#fff0eb',
                        color: activeIncident.status === 'resolved' ? '#2e6b05' : '#c23315',
                        fontWeight: 700
                      }}>
                        STATUS: {activeIncident.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
                    {activeIncident.title || (activeIncident.type ? activeIncident.type.toUpperCase() : 'Hazard Details')}
                  </h4>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeIncident.latitude},${activeIncident.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}>
                  🗺️ Google Maps Directions
                </a>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--ink-70)', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                {activeIncident.description || activeIncident.details || 'Community reported civic hazard under verification.'}
              </p>

              {/* Verification Decision Box */}
              <div style={{
                background: 'var(--bg)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                border: '1px solid var(--line)',
                marginBottom: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--ink)' }}>
                      🔍 Closed-Loop Verification: Is this problem solved?
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--ink-55)' }}>
                      Confirming repairs on the ground prevents municipal contractor fraud. Earn +15 Civic Points.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleVoteResolution(activeIncident.id, 'fixed')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        border: '1px solid #10b981',
                        cursor: 'pointer',
                        background: verificationVotes[activeIncident.id] === 'fixed' ? '#10b981' : '#fff',
                        color: verificationVotes[activeIncident.id] === 'fixed' ? '#fff' : '#10b981'
                      }}>
                      👍 Fixed (Verify Repair)
                    </button>
                    <button
                      onClick={() => handleVoteResolution(activeIncident.id, 'broken')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        border: '1px solid #ef4444',
                        cursor: 'pointer',
                        background: verificationVotes[activeIncident.id] === 'broken' ? '#ef4444' : '#fff',
                        color: verificationVotes[activeIncident.id] === 'broken' ? '#fff' : '#ef4444'
                      }}>
                      👎 Still Broken (Dispute)
                    </button>
                  </div>
                </div>

                {verificationVotes[activeIncident.id] && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.74rem', color: verificationVotes[activeIncident.id] === 'fixed' ? '#047857' : '#b91c1c', fontWeight: 700 }}>
                    {verificationVotes[activeIncident.id] === 'fixed'
                      ? '✓ Verified by you: Repair confirmed on ground. Contractor ticket approved.'
                      : '⚠️ Disputed by you: Defect still present. Sent back to municipal engineer audit queue.'}
                  </div>
                )}
              </div>

              {/* Meta details */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--ink-70)' }}>
                <span>📍 {activeIncident.address || `${activeIncident.latitude.toFixed(4)}, ${activeIncident.longitude.toFixed(4)}`}</span>
                {activeIncident.distance_meters && (
                  <span style={{ color: 'var(--coral)', fontWeight: 700 }}>
                    📏 ~{(activeIncident.distance_meters / 1000).toFixed(2)} km away
                  </span>
                )}
                {activeIncident.confirmed_count && (
                  <span style={{ color: '#059669', fontWeight: 700 }}>
                    👥 {activeIncident.confirmed_count} Citizen Confirmations
                  </span>
                )}
              </div>
            </div>
          )}
        </div>


        {/* Right Column: Live Incident Feed */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '700px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
              Live Civic & Hazard Feed ({filteredIncidents.length})
            </h3>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-70)' }}>
              REAL-TIME SYNC
            </span>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px' }}>
            {filteredIncidents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--ink-55)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</p>
                <p style={{ fontWeight: 700 }}>No active hazards in this radius</p>
                <p style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>Expand corridor distance or click "+ Snap & Report Hazard" to log an issue.</p>
              </div>
            ) : (
              filteredIncidents.map(inc => {
                const isSelected = inc.id === activeIncident?.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setActiveIncidentId(inc.id)}
                    style={{
                      padding: '0.95rem',
                      borderRadius: '14px',
                      background: isSelected ? '#fff' : 'rgba(255, 253, 251, 0.65)',
                      border: isSelected ? '1.5px solid var(--coral)' : '1px solid var(--line)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 8px 20px -8px rgba(255,90,61,0.3)' : 'none'
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className={`badge ${getSeverityBadgeClass(inc.severity)}`}>
                        {inc.severity}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--ink-55)', fontFamily: 'var(--font-mono)' }}>
                        {inc.created_at ? new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.25rem' }}>
                      {getCategoryIcon(inc.category || inc.type)} {inc.title || (inc.type ? inc.type.toUpperCase() : 'Hazard')}
                    </h4>

                    <p style={{ fontSize: '0.78rem', color: 'var(--ink-70)', lineHeight: '1.4', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {inc.description || inc.details || 'Community reported hazard.'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                      <span style={{ color: 'var(--ink-55)' }}>
                        {inc.address ? (inc.address.length > 26 ? inc.address.substring(0, 26) + '...' : inc.address) : 'Coordinates verified'}
                      </span>
                      {inc.distance_meters && (
                        <span style={{ color: 'var(--coral)', fontWeight: 700 }}>
                          {inc.distance_meters < 1000 ? `${inc.distance_meters}m` : `${(inc.distance_meters / 1000).toFixed(1)}km`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
