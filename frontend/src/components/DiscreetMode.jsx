import React, { useState } from 'react';

export default function DiscreetMode({ onExit, triggerSOS }) {
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [sosSent, setSosSent] = useState(false);

  const handleBtn = (val) => {
    if (val === 'C') {
      setCalcDisplay('0');
      return;
    }

    if (val === '=') {
      // Secret emergency codes: 112, 911, 100, 1091
      if (calcDisplay === '112' || calcDisplay === '911' || calcDisplay === '100' || calcDisplay === '1091') {
        triggerSOS();
        setSosSent(true);
        setTimeout(() => setSosSent(false), 3000);
        setCalcDisplay('0');
        return;
      }

      // Normal calculator eval
      try {
        const sanitized = calcDisplay.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcDisplay(String(res));
      } catch (e) {
        setCalcDisplay('Error');
      }
      return;
    }

    setCalcDisplay((prev) => (prev === '0' || prev === 'Error' ? val : prev + val));
  };

  return (
    <div style={{
      maxWidth: '380px',
      margin: '2rem auto',
      padding: '1.5rem',
      background: '#121212',
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
      border: '1px solid #262626',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Bar with Discreet Exit */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#525252', letterSpacing: '0.05em' }}>
          CALCULATOR
        </span>
        <button
          onClick={onExit}
          style={{ background: 'transparent', border: 'none', color: '#737373', fontSize: '0.75rem', cursor: 'pointer' }}>
          Back to FixTrack ✕
        </button>
      </div>

      {/* Screen */}
      <div style={{
        background: '#1c1c1e',
        borderRadius: '14px',
        padding: '1.25rem',
        textAlign: 'right',
        fontSize: '2.5rem',
        fontWeight: '300',
        color: '#ffffff',
        fontFamily: 'monospace',
        minHeight: '75px',
        marginBottom: '1.25rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {calcDisplay}
      </div>

      {sosSent && (
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#10b981', marginBottom: '0.75rem' }}>
          ✓ Action processed silently
        </div>
      )}

      {/* Calculator Buttons Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
        {['C', '+/-', '%', '/'].map((b) => (
          <button
            key={b}
            onClick={() => handleBtn(b === '+/-' ? '-' : b)}
            style={{
              padding: '1rem',
              borderRadius: '50%',
              aspectRatio: '1',
              background: '#a5a5a5',
              color: '#000',
              fontSize: '1.2rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}>
            {b}
          </button>
        ))}

        {['7', '8', '9', '*'].map((b) => (
          <button
            key={b}
            onClick={() => handleBtn(b)}
            style={{
              padding: '1rem',
              borderRadius: '50%',
              aspectRatio: '1',
              background: b === '*' ? '#ff9f0a' : '#333333',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}>
            {b === '*' ? '×' : b}
          </button>
        ))}

        {['4', '5', '6', '-'].map((b) => (
          <button
            key={b}
            onClick={() => handleBtn(b)}
            style={{
              padding: '1rem',
              borderRadius: '50%',
              aspectRatio: '1',
              background: b === '-' ? '#ff9f0a' : '#333333',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}>
            {b}
          </button>
        ))}

        {['1', '2', '3', '+'].map((b) => (
          <button
            key={b}
            onClick={() => handleBtn(b)}
            style={{
              padding: '1rem',
              borderRadius: '50%',
              aspectRatio: '1',
              background: b === '+' ? '#ff9f0a' : '#333333',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}>
            {b}
          </button>
        ))}

        <button
          onClick={() => handleBtn('0')}
          style={{
            gridColumn: 'span 2',
            padding: '1rem 1.5rem',
            borderRadius: '40px',
            background: '#333333',
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}>
          0
        </button>

        <button
          onClick={() => handleBtn('.')}
          style={{
            padding: '1rem',
            borderRadius: '50%',
            aspectRatio: '1',
            background: '#333333',
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer'
          }}>
          .
        </button>

        <button
          onClick={() => handleBtn('=')}
          style={{
            padding: '1rem',
            borderRadius: '50%',
            aspectRatio: '1',
            background: '#ff9f0a',
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer'
          }}>
          =
        </button>
      </div>

      <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.7rem', color: '#525252' }}>
        Secret Emergency Trigger: Type <strong>112</strong> or <strong>911</strong> and press <strong>=</strong>
      </div>
    </div>
  );
}

