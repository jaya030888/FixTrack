import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import IncidentMap from './components/IncidentMap';
import ReportForm from './components/ReportForm';
import SafetyTools from './components/SafetyTools';
import EmergencyContacts from './components/EmergencyContacts';
import AIAnalyzer from './components/AIAnalyzer';
import SafeWalk from './components/SafeWalk';
import DiscreetMode from './components/DiscreetMode';
import ShowcaseSuite from './components/ShowcaseSuite';
import PitchDemo from './components/PitchDemo';
import AdvancedFeaturesShowcase from './components/AdvancedFeaturesShowcase';
import AuthBar, { DEMO_ACCOUNTS } from './components/AuthBar';
import { getIncidents, createIncident } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('incidents');
  const [userLocation, setUserLocation] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [toast, setToast] = useState(null);
  const [sosModal, setSosModal] = useState(false);
  const [isDiscreetMode, setIsDiscreetMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fixtrack_user');
      return saved ? JSON.parse(saved) : DEMO_ACCOUNTS.citizen;
    } catch {
      return DEMO_ACCOUNTS.citizen;
    }
  });

  // Helper for toast messages
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Acquire user location
  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setUserLocation({ latitude: 28.6139, longitude: 77.2090 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setUserLocation(coords);
        showToast('📍 Live GPS location synchronized', 'success');
      },
      (err) => {
        console.warn('Geolocation warning:', err.message);
        setUserLocation({ latitude: 28.6139, longitude: 77.2090 });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Fetch incidents
  const loadIncidents = useCallback(async () => {
    try {
      const data = await getIncidents(userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : {});
      setIncidents(data);
    } catch (e) {
      console.error('Failed to load incidents:', e);
    }
  }, [userLocation]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  // Handle SOS Trigger
  const handleTriggerSOS = async () => {
    const lat = userLocation?.latitude || 28.6139;
    const lng = userLocation?.longitude || 77.2090;

    try {
      const sosIncident = {
        title: '🚨 IMMEDIATE EMERGENCY SOS SIGNAL',
        description: 'User initiated high-urgency SOS panic beacon. Urgent assistance required at coordinates.',
        category: 'sos',
        severity: 'critical',
        latitude: lat,
        longitude: lng,
        address: `EMERGENCY GPS (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
        status: 'open',
        ai_risk_score: 0.99
      };

      const created = await createIncident(sosIncident);
      setIncidents(prev => [created, ...prev]);
      if (!isDiscreetMode) {
        setSosModal(true);
      }
      showToast('🚨 SOS BEACON BROADCASTED!', 'danger');
    } catch (err) {
      showToast('Failed to broadcast SOS: ' + err.message, 'danger');
    }
  };

  const handleIncidentCreated = (newIncident) => {
    setIncidents(prev => [newIncident, ...prev]);
    showToast('✅ Safety report successfully submitted!', 'success');
    setActiveTab('incidents');
  };

  // If in discreet disguise mode, show calculator
  if (isDiscreetMode) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <DiscreetMode
          onExit={() => setIsDiscreetMode(false)}
          triggerSOS={handleTriggerSOS}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem 1rem 0 1rem' }}>
        <AuthBar currentUser={currentUser} onUserChange={setCurrentUser} />
      </div>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userLocation={userLocation}
        triggerSOS={handleTriggerSOS}
        onRefreshLocation={refreshLocation}
        onToggleDiscreet={() => setIsDiscreetMode(true)}
      />

      {/* Main Tab Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'incidents' && (
          <IncidentMap
            incidents={incidents}
            userLocation={userLocation}
            onNewReportClick={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'showcase' && (
          <>
            <ShowcaseSuite />
            <AdvancedFeaturesShowcase userLocation={userLocation} />
          </>
        )}

        {activeTab === 'pitch' && (
          <PitchDemo />
        )}

        {activeTab === 'safewalk' && (
          <SafeWalk
            userLocation={userLocation}
            triggerSOS={handleTriggerSOS}
          />
        )}

        {activeTab === 'report' && (
          <ReportForm
            userLocation={userLocation}
            onIncidentCreated={handleIncidentCreated}
            onCancel={() => setActiveTab('incidents')}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyTools
            userLocation={userLocation}
            triggerSOS={handleTriggerSOS}
          />
        )}

        {activeTab === 'contacts' && (
          <EmergencyContacts
            userLocation={userLocation}
          />
        )}

        {activeTab === 'ai' && (
          <AIAnalyzer />
        )}
      </main>

      {/* SOS Alert Modal */}
      {sosModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.85)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '2rem', textAlign: 'center', border: '2px solid #ef4444' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚨</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fca5a5' }}>EMERGENCY SOS LOGGED</h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
              Your distress beacon with live GPS coordinates has been saved to the incident registry.
            </p>

            <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setSosModal(false);
                  setActiveTab('contacts');
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}>
                💬 Notify Guardians via WhatsApp / SMS
              </button>

              <a
                href="tel:112"
                className="btn btn-danger"
                style={{ width: '100%', padding: '0.75rem' }}>
                📞 Call 112 National Police Helpline
              </a>

              <button
                onClick={() => setSosModal(false)}
                className="btn btn-secondary"
                style={{ width: '100%' }}>
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast notification */}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        padding: '1.25rem',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-dim)',
        background: 'rgba(11, 15, 25, 0.8)'
      }}>
        <div>FixTrack (HerHack) &bull; AI Safety & Civic Incident Response Platform</div>
      </footer>

    </div>
  );
}
