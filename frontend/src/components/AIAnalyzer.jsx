import React, { useState } from 'react';
import { analyzeThreatText } from '../services/api';

export default function AIAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [incidentType, setIncidentType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    {
      label: '🚨 Critical Threat (Stalker & Weapon)',
      text: 'A man in a black hoodie has been following me from the metro station. He pulled out a weapon and is threatening me near the dark alleyway. Please send help urgently!',
      type: 'harassment'
    },
    {
      label: '⚠️ High Risk (Dark Unlit Street)',
      text: 'The streetlights along Sector 15 road are completely out. Two individuals are loitering by the corner watching lone pedestrians pass by. It feels very dangerous.',
      type: 'unsafe_area'
    },
    {
      label: '🟢 Low Hazard (Broken Pavement)',
      text: 'The sidewalk tiles near the bus shelter are cracked. Could be a minor trip hazard for commuters.',
      type: 'hazard'
    }
  ];

  const handleRunAnalysis = async () => {
    if (!inputText.trim()) {
      alert('Please enter or select text to analyze.');
      return;
    }
    setLoading(true);
    try {
      const data = await analyzeThreatText(inputText, incidentType);
      setResult(data);
    } catch (e) {
      alert('Analysis error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem 3rem 1rem' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🧠</span> AI Threat & Risk Assessment Engine
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Uses natural language heuristics and ML scoring to detect urgent threat patterns and auto-escalate emergencies.
          </p>
        </div>

        {/* Quick Presets */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '600' }}>
            Quick Test Scenarios:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setInputText(p.text); setIncidentType(p.type); }}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', color: '#e2e8f0', marginBottom: '0.4rem', fontWeight: '600' }}>
            Incident Description or Audio Transcript
          </label>
          <textarea
            rows={5}
            className="input-field"
            placeholder="Type or paste incident description, witness report, or transcript..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Incident Type & Submit */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ minWidth: '220px' }}>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="input-field">
              <option value="general">General Incident</option>
              <option value="harassment">Harassment / Assault</option>
              <option value="stalking">Stalking / Surveillance</option>
              <option value="unsafe_area">Unsafe Environment</option>
              <option value="theft">Snatching / Theft</option>
            </select>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
            {loading ? 'Evaluating Model...' : '⚡ Run Threat Assessment'}
          </button>
        </div>

        {/* Results Display */}
        {result && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            borderRadius: '12px',
            border: `1px solid ${result.flagged ? '#ef4444' : 'var(--border-color)'}`,
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span className={`badge ${result.risk_score >= 0.7 ? 'badge-critical' : result.risk_score >= 0.4 ? 'badge-high' : 'badge-low'}`}>
                  {result.flagged ? 'FLAGGED HIGH RISK' : 'NORMAL RISK TIER'}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginTop: '0.4rem', color: 'var(--text-main)' }}>
                  Threat Risk Score: {Math.round(result.risk_score * 100)}%
                </h3>
              </div>

              <div style={{
                background: result.risk_score >= 0.7 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: result.risk_score >= 0.7 ? '#fca5a5' : '#6ee7b7',
                border: `1px solid ${result.risk_score >= 0.7 ? '#ef4444' : '#10b981'}`,
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}>
                {result.risk_score >= 0.75
                  ? 'TIER 3: IMMEDIATE INTERVENTION'
                  : result.risk_score >= 0.50
                  ? 'TIER 2: DISPATCH GEOFENCE ALERT'
                  : 'TIER 1: ADVISORY ONLY'}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
              {result.summary}
            </p>

            {result.keywords_detected && result.keywords_detected.length > 0 && (
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  Triggered Keywords / Indicators:
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {result.keywords_detected.map((kw, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                      ⚡ {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Model: {result.model_version}</span>
              <span>Latency: ~42ms</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

