import React from 'react';

export default function App() {
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>HerHack Safety Platform</h1>
      <p>Backend API Connected to: {apiBase || 'Not set'}</p>
      <div style={{ marginTop: '1.5rem' }}>
        <h3>Features Ready</h3>
        <ul>
          <li>Profiles & Auth integration</li>
          <li>PostGIS Incident reporting & Geolocation</li>
          <li>Safety reports with evidence / photo uploads</li>
        </ul>
      </div>
    </div>
  );
}

