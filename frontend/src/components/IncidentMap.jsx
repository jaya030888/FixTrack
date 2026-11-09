import React, { useState, useMemo } from 'react';
import { calculateDistance } from '../services/api';

export default function IncidentMap({ incidents, userLocation, onSelectIncident, onNewReportClick }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [maxRadiusMeters, setMaxRadiusMeters] = useState(10000);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIncidentId, setActiveIncidentId] = useState(null);

  // Compute filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      // Category filter
      const incCat = inc.category || inc.type;
      if (selectedCategory !== 'all' && incCat !== selectedCategory) return false;
      // Severity filter
      if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (inc.title || inc.type)?.toLowerCase().includes(q);
        const matchesDesc = (inc.description || inc.details)?.toLowerCase().includes(q);
        const matchesAddr = inc.address?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAddr) return false;
      }
      // Distance filter if user location available
      if (userLocation && inc.latitude && inc.longitude) {
        const dist = calculateDistance(userLocation.latitude, userLocation.longitude, inc.latitude, inc.longitude);
        if (dist > maxRadiusMeters) return false;
      }
      return true;
    });
  }, [incidents, selectedCategory, selectedSeverity, searchQuery, userLocation, maxRadiusMeters]);

  const activeIncident = incidents.find(i => i.id === activeIncidentId) || filteredIncidents[0];

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
      case 'harassment': return '⚠️';
      case 'stalking': return '👁️';
      case 'unsafe_area': return '💡';
      case 'safe_zone': return '🛡️';
      case 'theft': return '🚨';
      case 'sos': return '🆘';
      case 'pothole': return '🕳️';
      case 'garbage': return '🗑️';
      case 'street_light': return '💡';
      case 'open_drain':
      case 'drains': return '🌊';
      default: return '📍';
    }
  };

  return (
    <div style={{ padding: '0 1rem 2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Controls Bar */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
          
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search incidents or landmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field">
              <option value="all">All Categories</option>
              <option value="harassment">Harassment</option>
              <option value="stalking">Stalking</option>
              <option value="unsafe_area">Unsafe Area / Broken Lights</option>
              <option value="theft">Theft / Snatching</option>
              <option value="sos">Emergency SOS Alerts</option>
              <option value="safe_zone">Verified Safe Zones</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="input-field">
              <option value="all">All Severities</option>
              <option value="critical">Critical Urgency</option>
              <option value="high">High Threat</option>
              <option value="medium">Medium Hazard</option>
              <option value="low">Low Risk / Safe</option>
            </select>
          </div>

          {/* Radius Selector */}
          <div>
            <select
              value={maxRadiusMeters}
              onChange={(e) => setMaxRadiusMeters(Number(e.target.value))}
              className="input-field">
              <option value={1000}>Within 1 km</option>
              <option value={3000}>Within 3 km</option>
              <option value={5000}>Within 5 km</option>
              <option value={10000}>Within 10 km</option>
              <option value={50000}>All Incidents (50 km)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Grid: Radar Map & Incident List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1fr)', gap: '1.25rem' }}>
        
        {/* Radar & Visual Map Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 10px #f43f5e' }} />
                Spatial Radar & Geofence
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Showing incidents relative to your live GPS coordinates
              </p>
            </div>
            <button onClick={onNewReportClick} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}>
              + Report Hazard
            </button>
          </div>

          {/* SVG Radar Display */}
          <div style={{
            position: 'relative',
            background: 'radial-gradient(circle, rgba(23, 32, 54, 0.9) 0%, rgba(11, 15, 25, 0.95) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            height: '360px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Concentric distance rings */}
            <svg width="100%" height="100%" viewBox="-150 -150 300 300" style={{ position: 'absolute', top: 0, left: 0 }}>
              {/* Radar circles */}
              <circle cx="0" cy="0" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <circle cx="0" cy="0" r="80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="0" cy="0" r="120" fill="none" stroke="rgba(244,63,94,0.15)" strokeWidth="1" />

              {/* Crosshairs */}
              <line x1="-140" y1="0" x2="140" y2="0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="0" y1="-140" x2="0" y2="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

              {/* Distance Labels */}
              <text x="5" y="-42" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">1km</text>
              <text x="5" y="-82" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">3km</text>
              <text x="5" y="-122" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">5km+</text>

              {/* Center User Dot */}
              <circle cx="0" cy="0" r="6" fill="#0ea5e9" />
              <circle cx="0" cy="0" r="12" fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="6;20" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Incident Pins */}
              {filteredIncidents.map((inc, idx) => {
                // Calculate pseudo x, y based on lat/lng difference from user
                const userLat = userLocation?.latitude || 28.6139;
                const userLng = userLocation?.longitude || 77.2090;
                const dLat = (inc.latitude - userLat) * 3500;
                const dLng = (inc.longitude - userLng) * 3500;
                
                // Constrain within radar circle
                const dist = Math.sqrt(dLng * dLng + dLat * dLat);
                const scale = dist > 125 ? 125 / dist : 1;
                const cx = dLng * scale;
                const cy = -dLat * scale; // Invert latitude for SVG y

                const isSelected = inc.id === activeIncident?.id;
                const pinColor = inc.severity === 'critical' ? '#ef4444' : inc.severity === 'high' ? '#f97316' : inc.severity === 'medium' ? '#f59e0b' : '#10b981';

                return (
                  <g key={inc.id || idx} style={{ cursor: 'pointer' }} onClick={() => setActiveIncidentId(inc.id)}>
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="14" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="2 2" />
                    )}
                    <circle cx={cx} cy={cy} r={isSelected ? 8 : 6} fill={pinColor} />
                    <text x={cx + 8} y={cy + 3} fill="#fff" fontSize="9" fontWeight="bold">
                      {inc.category === 'sos' ? 'SOS' : ((inc.title || inc.type || inc.category || 'Incident').substring(0, 10))}...
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom info banner on radar */}
            <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>📍 Blue: You (Current GPS)</span>
              <span>🔴 Critical &nbsp; 🟠 High &nbsp; 🟡 Medium &nbsp; 🟢 Safe</span>
            </div>
          </div>

          {/* Selected Incident Inspector */}
          {activeIncident && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <span className={`badge ${getSeverityBadgeClass(activeIncident.severity)}`} style={{ marginRight: '0.5rem' }}>
                    {activeIncident.severity}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {getCategoryIcon(activeIncident.category || activeIncident.type)} {activeIncident.category || activeIncident.type}
                  </span>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginTop: '0.35rem', color: '#fff' }}>
                    {activeIncident.title || (activeIncident.type ? activeIncident.type.toUpperCase() : 'Incident Details')}
                  </h3>
                </div>
                
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeIncident.latitude},${activeIncident.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                  🗺️ Open in Google Maps
                </a>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                {activeIncident.description || activeIncident.details || 'Community reported civic hazard.'}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>📍 {activeIncident.address || `${activeIncident.latitude}, ${activeIncident.longitude}`}</span>
                {activeIncident.distance_meters && (
                  <span style={{ color: '#38bdf8', fontWeight: '600' }}>
                    📏 ~{(activeIncident.distance_meters / 1000).toFixed(2)} km away
                  </span>
                )}
                {activeIncident.ai_risk_score && (
                  <span style={{ color: '#f43f5e', fontWeight: '600' }}>
                    🧠 AI Risk Score: {Math.round(activeIncident.ai_risk_score * 100)}%
                  </span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Incidents Feed Panel */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '620px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              Live Incident Feed ({filteredIncidents.length})
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Real-time updates
            </span>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px' }}>
            {filteredIncidents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🛡️</p>
                <p style={{ fontWeight: '600' }}>No incidents found in this area</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Try expanding your search radius or clearing category filters.</p>
              </div>
            ) : (
              filteredIncidents.map(inc => {
                const isSelected = inc.id === activeIncident?.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setActiveIncidentId(inc.id)}
                    style={{
                      padding: '0.9rem',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(244, 63, 94, 0.12)' : 'rgba(15, 23, 42, 0.5)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className={`badge ${getSeverityBadgeClass(inc.severity)}`}>
                        {inc.severity}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {inc.created_at ? new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff', marginBottom: '0.25rem' }}>
                      {getCategoryIcon(inc.category || inc.type)} {inc.title || (inc.type ? inc.type.toUpperCase() : 'Reported Incident')}
                    </h4>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {inc.description || inc.details || 'Community reported hazard.'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>
                        {inc.address ? (inc.address.length > 28 ? inc.address.substring(0, 28) + '...' : inc.address) : 'Coordinates reported'}
                      </span>
                      {inc.distance_meters && (
                        <span style={{ color: '#38bdf8', fontWeight: '700' }}>
                          {inc.distance_meters < 1000 ? `${inc.distance_meters}m` : `${(inc.distance_meters / 1000).toFixed(1)}km`} away
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

