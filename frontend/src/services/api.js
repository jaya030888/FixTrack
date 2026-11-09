/**
 * FixTrack API Service
 * Manages communication with FastAPI backend, AI microservice, and Supabase.
 * Includes graceful offline/fallback handling so the app is always functional.
 */

import { supabase, photoBucketName } from './supabase';

const BACKEND_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BACKEND_URL !== undefined && process.env?.NEXT_PUBLIC_BACKEND_URL !== '')
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
    ? process.env.NEXT_PUBLIC_API_URL
    : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:8000');
const AI_SERVICE_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_AI_SERVICE_URL) || 'http://localhost:8001';

// Seed demo incidents for initial experience centered around common coordinates or user GPS
const DEFAULT_INCIDENTS = [
  {
    id: 'inc-001',
    title: 'Broken Streetlights & Poor Visibility',
    description: 'The entire 200m stretch between Metro Gate 2 and Bus Stop is completely dark. High risk of stalking.',
    category: 'unsafe_area',
    severity: 'high',
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Near Central Metro Station, Gate 2',
    status: 'open',
    distance_meters: 350,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    ai_risk_score: 0.78,
    photo_urls: []
  },
  {
    id: 'inc-002',
    title: 'Suspicious Individual Following Pedestrians',
    description: 'Individual wearing black jacket repeatedly following lone women along the park walkway.',
    category: 'harassment',
    severity: 'critical',
    latitude: 28.6189,
    longitude: 77.2150,
    address: 'East City Park Outer Walkway',
    status: 'investigating',
    distance_meters: 850,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ai_risk_score: 0.89,
    photo_urls: []
  },
  {
    id: 'inc-003',
    title: 'Unmonitored Abandoned Structure',
    description: 'Abandoned construction building with no lighting or security guards. Groups gathering late at night.',
    category: 'unsafe_area',
    severity: 'medium',
    latitude: 28.6090,
    longitude: 77.2010,
    address: 'Plot 4B, Industrial Area Sector 6',
    status: 'open',
    distance_meters: 1400,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    ai_risk_score: 0.55,
    photo_urls: []
  },
  {
    id: 'inc-004',
    title: 'Safe Haven & Verified Police Booth',
    description: '24/7 active Pink Booth with female police personnel on duty. Safe spot for immediate assistance.',
    category: 'safe_zone',
    severity: 'low',
    latitude: 28.6160,
    longitude: 77.2050,
    address: 'Connaught Outer Circle, Women Safety Post',
    status: 'resolved',
    distance_meters: 600,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ai_risk_score: 0.10,
    photo_urls: []
  }
];

function getStoredIncidents() {
  const cached = localStorage.getItem('fixtrack_incidents');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return DEFAULT_INCIDENTS;
    }
  }
  localStorage.setItem('fixtrack_incidents', JSON.stringify(DEFAULT_INCIDENTS));
  return DEFAULT_INCIDENTS;
}

function saveStoredIncidents(incidents) {
  localStorage.setItem('fixtrack_incidents', JSON.stringify(incidents));
}

// Calculate distance in meters using Haversine formula
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Fetch all incidents or nearby incidents
 */
export async function getIncidents({ lat, lng, radius_meters = 5000, category = null, status = null } = {}) {
  // Try backend first
  try {
    let url = `${BACKEND_URL}/api/incidents`;
    if (lat && lng) {
      url = `${BACKEND_URL}/api/incidents/nearby?lat=${lat}&lng=${lng}&radius_meters=${radius_meters}`;
    }
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend unavailable, using cached/local incidents store:', err.message);
  }

  // Fallback to local storage
  let incidents = getStoredIncidents();

  if (category && category !== 'all') {
    incidents = incidents.filter(i => i.category === category);
  }
  if (status && status !== 'all') {
    incidents = incidents.filter(i => i.status === status);
  }

  // Update distance_meters if user location provided
  if (lat && lng) {
    incidents = incidents.map(item => ({
      ...item,
      distance_meters: calculateDistance(lat, lng, item.latitude, item.longitude)
    })).filter(item => item.distance_meters <= radius_meters)
      .sort((a, b) => (a.distance_meters || 0) - (b.distance_meters || 0));
  }

  return incidents;
}

/**
 * Create a new incident
 */
export async function createIncident(incidentData) {
  // Attempt backend POST
  try {
    const response = await fetch(`${BACKEND_URL}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData),
      signal: AbortSignal.timeout(4000)
    });
    if (response.ok) {
      const created = await response.json();
      const current = getStoredIncidents();
      saveStoredIncidents([created, ...current]);
      return created;
    }
  } catch (err) {
    console.warn('Backend offline, saving incident locally:', err.message);
  }

  // Local fallback
  const newIncident = {
    ...incidentData,
    id: `inc-${Date.now()}`,
    created_at: new Date().toISOString(),
    status: incidentData.status || 'open'
  };

  const current = getStoredIncidents();
  saveStoredIncidents([newIncident, ...current]);
  return newIncident;
}

/**
 * AI Threat & Risk Assessment
 */
export async function analyzeThreatText(text, incident_type = 'general') {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, incident_type }),
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('AI microservice offline, running heuristic risk analysis:', err.message);
  }

  // Intelligent client-side heuristic fallback
  const lower = text.toLowerCase();
  const criticalKeywords = ['attack', 'stalker', 'weapon', 'gun', 'knife', 'assault', 'violence', 'chasing'];
  const highKeywords = ['danger', 'threat', 'urgent', 'alone', 'scared', 'following', 'harass', 'dark', 'screaming'];
  const mediumKeywords = ['suspicious', 'crowd', 'unlit', 'unsafe', 'strange', 'isolated', 'shouting'];

  let detectedCritical = criticalKeywords.filter(k => lower.includes(k));
  let detectedHigh = highKeywords.filter(k => lower.includes(k));
  let detectedMedium = mediumKeywords.filter(k => lower.includes(k));

  let score = 0.20;
  if (detectedCritical.length > 0) {
    score = Math.min(0.95, 0.75 + detectedCritical.length * 0.1);
  } else if (detectedHigh.length > 0) {
    score = Math.min(0.85, 0.55 + detectedHigh.length * 0.1);
  } else if (detectedMedium.length > 0) {
    score = Math.min(0.65, 0.35 + detectedMedium.length * 0.1);
  }

  return {
    risk_score: parseFloat(score.toFixed(2)),
    model_version: 'safety-threat-detector-client-v1',
    flagged: score >= 0.70,
    keywords_detected: [...detectedCritical, ...detectedHigh, ...detectedMedium],
    summary: score >= 0.70 ? 'CRITICAL RISK: Potential direct threat detected' : 'Standard or moderate hazard detected'
  };
}

/**
 * Upload Image
 */
export async function uploadEvidencePhoto(file) {
  // If file is empty
  if (!file) return null;

  // 1. Try Backend Upload
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BACKEND_URL}/api/photos/upload`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
  } catch (err) {
    console.warn('Backend upload failed, attempting Supabase direct / local fallback:', err.message);
  }

  // 2. Try Supabase direct upload if initialized
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const { data, error } = await supabase.storage.from(photoBucketName).upload(fileName, file);
    if (!error && data) {
      const { data: pubData } = supabase.storage.from(photoBucketName).getPublicUrl(fileName);
      return pubData.publicUrl;
    }
  } catch (e) {
    // Ignore and fallback to FileReader DataURL
  }

  // 3. Fallback to Data URL for instant visual preview
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

/**
 * YOLOv8 Object & Road Hazard Detection via Backend
 */
export async function detectImageHazards(file) {
  if (!file) return null;
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BACKEND_URL}/api/ai/detect`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('YOLOv8 hazard detection request failed:', err.message);
  }
  return null;
}
