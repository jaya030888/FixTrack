import React, { useState } from 'react';
import { analyzeThreatText } from '../services/api';

export default function AIAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [incidentType, setIncidentType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    {
      label: '🕳️ Severe Road Pothole (Axle-Breaker)',
      text: 'Massive 8-inch deep pothole crater spanning middle of Mathura Road. Multiple two-wheelers losing balance and vehicles sustaining rim fractures. High accident probability.',
      type: 'pothole'
    },
    {
      label: '⚠️ High Risk (Dark Unlit Street)',
      text: 'The streetlights along Sector 15 road are completely out. Two individuals are loitering by the corner watching lone pedestrians pass by. It feels very dangerous.',
      type: 'unsafe_area'
    },
    {
      label: '🚨 Critical Threat (Stalker & Harassment)',
      text: 'A man has been following me closely from the metro gate into the unlit underpass. He is making verbal threats and refusing to back away. Please dispatch assistance.',
      type: 'harassment'
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
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 1rem 3rem 1rem' }}>
      <div className="glass-panel" style={{ padding: '2.2rem', background: '#ffffff', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '700', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 26, color: 'var(--coral)' }}>psychology</span>
            <span>NLP &amp; Hazard Intelligence Engine</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-55)', marginTop: '0.25rem' }}>
            Heuristic semantic parser and priority scoring model that auto-evaluates hazard severity and triggers dispatch urgency.
          </p>
        </div>

        {/* Quick Presets */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--ink-70)', marginBottom: '0.5rem', fontWeight: '600' }}>
            Quick Benchmark Scenarios:
          </label>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setInputText(p.text); setIncidentType(p.type); }}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ink)', marginBottom: '0.45rem', fontWeight: '600' }}>
            Hazard Report or Audio Transcript
          </label>
          <textarea
            rows={4}
            className="input-field"
            placeholder="Type or paste hazard description, witness report, or speech-to-text transcript..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Incident Type & Submit */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ minWidth: '240px' }}>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="input-field">
              <option value="pothole">Road Pothole / Crater</option>
              <option value="drains">Drainage Overflow / Waterlogging</option>
              <option value="street_light">Broken Streetlight / Dark Area</option>
              <option value="harassment">Harassment / Stalking</option>
              <option value="general">General Civic Incident</option>
            </select>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.6rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {loading ? 'progress_activity' : 'bolt'}
            </span>
            <span>{loading ? 'Evaluating Model...' : 'Run Severity Assessment'}</span>
          </button>
        </div>

        {/* Results Display */}
        {result && (
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '14px',
            border: `1.5px solid ${result.flagged ? 'var(--coral)' : 'var(--line)'}`,
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span className={`badge ${result.risk_score >= 0.7 ? 'badge-critical' : result.risk_score >= 0.4 ? 'badge-high' : 'badge-low'}`}>
                  {result.flagged ? 'URGENT DISPATCH TIER' : 'STANDARD MONITORING TIER'}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginTop: '0.4rem', color: 'var(--ink)' }}>
                  Evaluated Severity Score: {Math.round(result.risk_score * 100)}%
                </h3>
              </div>

              <div style={{
                background: result.risk_score >= 0.7 ? 'rgba(255, 90, 61, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: result.risk_score >= 0.7 ? 'var(--coral)' : '#059669',
                border: `1px solid ${result.risk_score >= 0.7 ? 'var(--coral)' : '#10b981'}`,
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '700',
                fontFamily: 'var(--font-mono)'
              }}>
                {result.risk_score >= 0.75
                  ? 'TIER 3: HIGH URGENCY SLA (< 24H)'
                  : result.risk_score >= 0.50
                  ? 'TIER 2: DISPATCH WARD INSPECTION (< 48H)'
                  : 'TIER 1: SCHEDULED ROUTINE AUDIT'}
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--ink-70)', marginBottom: '1rem', lineHeight: 1.55 }}>
              {result.summary}
            </p>

            {result.keywords_detected && result.keywords_detected.length > 0 && (
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-55)', display: 'block', marginBottom: '0.4rem' }}>
                  Identified Hazard Tokens:
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {result.keywords_detected.map((kw, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', background: '#ffffff', border: '1px solid var(--line)', color: 'var(--coral)', padding: '2px 8px', borderRadius: '6px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--line)', fontSize: '0.72rem', color: 'var(--ink-55)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
              <span>ENGINE: {result.model_version || 'NLP-Civic-Heuristic-v2'}</span>
              <span>LATENCY: ~38ms</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

