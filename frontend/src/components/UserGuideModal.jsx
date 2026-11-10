import React, { useState } from 'react';

export default function UserGuideModal({ isOpen, onClose, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Snap a Photo of Any Road Defect',
      badge: 'REPORTING',
      icon: 'photo_camera',
      color: 'var(--coral)',
      bg: '#fff0eb',
      headline: 'Instant AI Hazard Scanner',
      description: 'Whenever you encounter a dangerous pothole, overflowing drain, or broken streetlight, tap "Report a Hazard" and snap a photo. Our custom YOLOv8 AI instantly detects the crater boundary, measures surface area in square meters, and calculates severity in under 1.2 seconds.',
      actionText: 'Try Reporting a Hazard →',
      actionTab: 'report'
    },
    {
      step: '02',
      title: 'PostGIS Stops Duplicate Complaints',
      badge: 'SPATIAL SMART CLUSTERING',
      icon: 'share_location',
      color: '#16a34a',
      bg: '#f0fdf4',
      headline: 'Zero Complaint Clutter',
      description: 'If other citizens have already reported the same pothole on your street, FixTrack automatically recognizes it within a 30-meter radius. Instead of creating a duplicate ticket, it adds your confirmation vote, pushing the urgency higher on the Municipal Ward Engineer’s dashboard.',
      actionText: 'View Live Road Radar →',
      actionTab: 'incidents'
    },
    {
      step: '03',
      title: 'Choose: Fast Commute or Safe Corridor',
      badge: 'DUAL NAVIGATION',
      icon: 'alt_route',
      color: '#8b5cf6',
      bg: '#f5f3ff',
      headline: 'Road Safety Meets Personal Safety',
      description: 'Enter your Departure (Point A) and Arrival (Point B) on the Road Radar. FixTrack gives you two options: the Fastest Route, or the Women-Special Safe Corridor which routes you through 100% illuminated streets, open commercial shops, and active Pink Police booths.',
      actionText: 'Explore Safe Transit →',
      actionTab: 'incidents'
    },
    {
      step: '04',
      title: 'Verify Real Repairs & Earn Civic Points',
      badge: 'CLOSED-LOOP CITIZEN AUDIT',
      icon: 'verified',
      color: '#0284c7',
      bg: '#f0f9ff',
      headline: 'Stop Contractor Fraud',
      description: 'Municipal contractors cannot mark road repairs done on paper. When crews upload a repair photo, local citizens inspect the paved bitumen and vote "Fixed 👍" or "Still Broken 👎". Every verified audit awards you +15 Civic Karma Points toward community leaderboards.',
      actionText: 'Check Road Audits →',
      actionTab: 'incidents'
    },
    {
      step: '05',
      title: 'Emergency Safety & Secret Calculator Mode',
      badge: 'WOMEN SAFETY PILLAR',
      icon: 'shield_with_heart',
      color: '#db2777',
      bg: '#fdf2f8',
      headline: 'Discreet Protection Always Ready',
      description: 'Need covert protection? Switch to "Disguise" mode: FixTrack looks and functions like a normal calculator, but entering your PIN silently broadcasts an SOS distress beacon with live GPS coordinates to your emergency guardians and 112 helpline.',
      actionText: 'Open Women Safety Tools →',
      actionTab: 'safewalk'
    }
  ];

  const current = steps[currentStep];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(23, 21, 26, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      animation: 'rise-in 0.3s ease-out'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '28px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid var(--line)',
        boxShadow: '0 30px 80px -20px rgba(23, 21, 26, 0.4)',
        padding: '2.5rem',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--line)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--ink)'
          }}
          title="Close Guide">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
        </button>

        {/* Top Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: 'var(--coral)', fontWeight: 700, textTransform: 'uppercase' }}>
            SIMPLE USER GUIDE · STEP {currentStep + 1} OF {steps.length}
          </span>
        </div>

        <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.15, marginBottom: '1.5rem' }}>
          How FixTrack Works
        </h2>

        {/* Step Navigation Dots / Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                borderRadius: '12px',
                border: currentStep === idx ? `2px solid ${s.color}` : '1px solid var(--line)',
                background: currentStep === idx ? s.bg : '#ffffff',
                color: currentStep === idx ? s.color : 'var(--ink-55)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}>
              <span>{s.step}</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{s.icon}</span>
            </button>
          ))}
        </div>

        {/* Current Step Card */}
        <div style={{
          background: current.bg,
          border: `1.5px solid ${current.color}`,
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: current.color,
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{current.icon}</span>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: current.color, fontWeight: 700, letterSpacing: '0.08em' }}>
                {current.badge}
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                {current.title}
              </h3>
            </div>
          </div>

          <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>
            {current.headline}
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--ink-70)', lineHeight: 1.65, margin: 0 }}>
            {current.description}
          </p>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={() => {
                onClose();
                onNavigate(current.actionTab);
              }}
              style={{
                background: current.color,
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 6px 18px -6px rgba(0,0,0,0.3)'
              }}>
              <span>{current.actionText}</span>
            </button>
          </div>
        </div>

        {/* Step Forward / Backward Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '999px',
              border: '1px solid var(--line)',
              background: '#ffffff',
              color: currentStep === 0 ? 'var(--ink-35)' : 'var(--ink)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            <span>Previous</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
              <span>Next Step</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#16a34a'
              }}>
              <span>Got it! Start Using FixTrack</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
