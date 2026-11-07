import React, { useState, useEffect, useRef } from 'react';

export default function SafetyTools({ userLocation, triggerSOS, emergencyContacts = [] }) {
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [fakeCallCountdown, setFakeCallCountdown] = useState(null);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceDetectedKeyword, setVoiceDetectedKeyword] = useState(null);
  
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const sirenIntervalRef = useRef(null);
  const recognitionRef = useRef(null);

  // Siren synthesis using Web Audio API
  const startSiren = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.5, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

      // Cycle between 700Hz and 1300Hz
      let high = false;
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      sirenIntervalRef.current = setInterval(() => {
        if (!oscillatorRef.current || ctx.state === 'closed') return;
        high = !high;
        osc.frequency.setTargetAtTime(high ? 1300 : 700, ctx.currentTime, 0.15);
      }, 350);

      setIsSirenPlaying(true);
    } catch (e) {
      alert('Audio playback error: ' + e.message);
    }
  };

  const stopSiren = () => {
    if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
    }
    setIsSirenPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopSiren();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  // Hands-free Voice Distress Recognition
  const toggleVoiceSOS = () => {
    if (isListeningVoice) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningVoice(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListeningVoice(true);
      };

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript.toLowerCase();
          const triggers = ['help', 'bachao', 'police', 'save me', 'madad', 'emergency'];
          
          for (const word of triggers) {
            if (transcript.includes(word)) {
              setVoiceDetectedKeyword(word);
              triggerSOS();
              startSiren();
              setTimeout(() => setVoiceDetectedKeyword(null), 4000);
              break;
            }
          }
        }
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition warning:', err.error);
        if (err.error === 'not-allowed') {
          alert('Microphone permission denied. Please allow microphone access for hands-free voice SOS.');
          setIsListeningVoice(false);
        }
      };

      recognition.onend = () => {
        // Auto restart if still marked as listening
        if (isListeningVoice && recognitionRef.current) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      alert('Failed to initialize voice recognition: ' + err.message);
    }
  };

  // Fake Call Simulator
  const scheduleFakeCall = (seconds = 5) => {
    setFakeCallCountdown(seconds);
    const interval = setInterval(() => {
      setFakeCallCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFakeCallActive(true);
          // Vibrate phone if supported
          if ('vibrate' in navigator) {
            navigator.vibrate([600, 300, 600, 300, 600]);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const helplines = [
    { number: '112', title: 'National All-in-One Emergency', badge: 'Pan-India', desc: 'Police, Fire & Medical' },
    { number: '1091', title: 'Women Helpline', badge: 'Safety & Harassment', desc: 'Dedicated 24x7 women support' },
    { number: '100', title: 'Police Emergency Patrol', badge: 'Immediate PCR', desc: 'Direct police control room' },
    { number: '181', title: 'Women in Distress', badge: 'Crisis Hotline', desc: 'Counseling & rescue support' },
    { number: '102', title: 'Ambulance & Medical', badge: 'Health', desc: 'Urgent medical assistance' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem 3rem 1rem' }}>
      
      {/* Voice Trigger Alert Banner */}
      {voiceDetectedKeyword && (
        <div style={{
          background: '#ef4444',
          color: '#fff',
          padding: '1rem',
          borderRadius: '12px',
          textAlign: 'center',
          fontWeight: '800',
          fontSize: '1.1rem',
          marginBottom: '1.5rem',
          boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)'
        }}>
          🚨 VOICE DISTRESS DETECTED: "{voiceDetectedKeyword.toUpperCase()}" - SOS BROADCASTED!
        </div>
      )}

      {/* Fake Call Overlay Screen */}
      {fakeCallActive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(180deg, #090d16 0%, #1e1b4b 100%)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4rem 2rem'
        }}>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              fontSize: '2.5rem',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
            }}>
              👮
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>Police Inspector / Home</h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.3rem' }}>Incoming Call...</p>
          </div>

          <div style={{ display: 'flex', gap: '3rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setFakeCallActive(false)}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                fontSize: '1.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
              }}>
              📞
            </button>

            <button
              onClick={() => {
                alert('Call connected. Speak aloud to deter any bystander: "Yes Inspector, I am near the main crossing, waiting for your patrol car."');
                setFakeCallActive(false);
              }}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                fontSize: '1.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
              }}>
              📱
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Urgent Emergency SOS Panic Card */}
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fca5a5', marginBottom: '0.5rem' }}>
            🆘 One-Touch Emergency SOS
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Broadcasts your GPS position, logs a critical incident, and prepares emergency notifications.
          </p>

          <button
            onClick={triggerSOS}
            className="btn btn-danger animate-pulse-sos"
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              fontSize: '1.5rem',
              fontWeight: '900',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem'
            }}>
            <span>🚨</span>
            <span>SOS</span>
          </button>

          <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Location: {userLocation ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : 'Waiting for GPS...'}
          </div>
        </div>

        {/* High-Decibel Siren & Strobe */}
        <div className={`glass-panel ${isSirenPlaying ? 'siren-active' : ''}`} style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>
            🔊 High-Decibel Audio Siren
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Produces a piercing dual-tone alarm to attract public attention and disorient perpetrators.
          </p>

          <button
            onClick={isSirenPlaying ? stopSiren : startSiren}
            className={`btn ${isSirenPlaying ? 'btn-danger' : 'btn-primary'}`}
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              fontSize: '1.1rem',
              fontWeight: '800',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}>
            <span style={{ fontSize: '1.8rem' }}>{isSirenPlaying ? '⏹️' : '📢'}</span>
            <span>{isSirenPlaying ? 'STOP SIREN' : 'START SIREN'}</span>
          </button>

          <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: isSirenPlaying ? '#ef4444' : 'var(--text-dim)' }}>
            {isSirenPlaying ? 'SIREN ACTIVE: Turn volume to max' : 'Synthesized via HTML5 Web Audio'}
          </div>
        </div>

        {/* Hands-Free Voice SOS Listener */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🎙️</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
              Hands-Free Voice SOS
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Can't reach your screen? Activate hands-free voice guard. Shouting "Help" or "Bachao" immediately triggers SOS.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={toggleVoiceSOS}
              className={`btn ${isListeningVoice ? 'btn-danger' : 'btn-secondary'}`}
              style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}>
              {isListeningVoice ? '🔴 Stop Voice Guard (Listening Active)' : '🟢 Turn On Hands-Free Voice SOS'}
            </button>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: '1.4', background: 'rgba(15, 23, 42, 0.5)', padding: '0.65rem', borderRadius: '8px' }}>
              <span>Trigger phrases:</span>
              <strong style={{ color: '#f43f5e' }}> "Help", "Bachao", "Police", "Save me", "Madad"</strong>
            </div>
          </div>
        </div>

        {/* Fake Incoming Call Simulator */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📞</span> Fake Incoming Call
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Need an excuse to leave an uncomfortable space? Trigger an authentic incoming call.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => scheduleFakeCall(0)}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start' }}>
              ⚡ Ring Immediately
            </button>
            <button
              onClick={() => scheduleFakeCall(5)}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start' }}>
              ⏱️ Ring in 5 Seconds
            </button>
            <button
              onClick={() => scheduleFakeCall(15)}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start' }}>
              ⏱️ Ring in 15 Seconds
            </button>

            {fakeCallCountdown !== null && (
              <div style={{ marginTop: '0.5rem', textAlign: 'center', color: '#38bdf8', fontWeight: '700', fontSize: '0.9rem' }}>
                Incoming call in {fakeCallCountdown}s...
              </div>
            )}
          </div>
        </div>

        {/* Emergency Helpline Directory */}
        <div className="glass-panel" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚡</span> Direct Emergency Helplines
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            One-touch instant direct dial to national emergency and crisis teams.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {helplines.map((item, idx) => (
              <a
                key={idx}
                href={`tel:${item.number}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s'
                }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>{item.number}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#fff' }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <span className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}>
                  CALL 📞
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
