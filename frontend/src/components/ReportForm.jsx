import React, { useState, useEffect } from 'react';
import { createIncident, analyzeThreatText, uploadEvidencePhoto, detectImageHazards } from '../services/api';
import { compressImage } from '../services/imageCompressor';
import { getFriendlyErrorMessage } from '../services/errorHandler';

export default function ReportForm({ userLocation, onIncidentCreated, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('pothole');
  const [severity, setSeverity] = useState('medium');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(userLocation?.latitude || 28.6139);
  const [longitude, setLongitude] = useState(userLocation?.longitude || 77.2090);
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Live AI threat scoring state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // YOLOv8 vision AI state
  const [yoloDetection, setYoloDetection] = useState(null);
  const [isDetectingImage, setIsDetectingImage] = useState(false);

  // Update coords if user location changes
  useEffect(() => {
    if (userLocation) {
      setLatitude(userLocation.latitude);
      setLongitude(userLocation.longitude);
      if (!address) {
        setAddress(`GPS (${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)})`);
      }
    }
  }, [userLocation]);

  // Debounced AI threat scoring on description change
  useEffect(() => {
    if (!description || description.trim().length < 8) {
      setAiAnalysis(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const result = await analyzeThreatText(description, category);
        setAiAnalysis(result);
        // Automatically suggest severity if critical threat detected
        if (result.flagged && result.risk_score >= 0.8) {
          setSeverity('critical');
        } else if (result.risk_score >= 0.6) {
          setSeverity('high');
        }
      } catch (err) {
        console.error('AI check error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [description, category]);

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      let uploadFile = file;
      try {
        uploadFile = await compressImage(file);
      } catch (err) {
        uploadFile = file;
      }

      setPhotoFile(uploadFile);
      const url = URL.createObjectURL(uploadFile);
      setPhotoPreview(url);
      setYoloDetection(null);

      // Trigger YOLOv8 hazard scan
      setIsDetectingImage(true);
      try {
        const detected = await detectImageHazards(file);
        if (detected && detected.detected) {
          setYoloDetection(detected);
          if (detected.severity_assessment === 'high') {
            setSeverity('high');
          }
        }
      } catch (err) {
        console.warn('Image detection err:', err);
      } finally {
        setIsDetectingImage(false);
      }
    }
  };

  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Location is not supported on this browser. You can enter the landmark manually.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setAddress(`Verified GPS (${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)})`);
      },
      (err) => {
        const friendly = getFriendlyErrorMessage(err);
        alert(`${friendly.title}\n${friendly.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an incident title');
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl = null;
      if (photoFile) {
        photoUrl = await uploadEvidencePhoto(photoFile);
      }

      const incidentPayload = {
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || `${latitude}, ${longitude}`,
        status: 'open',
        ai_risk_score: aiAnalysis ? aiAnalysis.risk_score : 0.3,
        photo_urls: photoUrl ? [photoUrl] : []
      };

      const created = await createIncident(incidentPayload);
      onIncidentCreated(created);
    } catch (err) {
      alert('Failed to report incident: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem 3rem 1rem' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📢</span> Report Incident or Safety Hazard
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Your report alerts the community and creates a verified PostGIS geolocated record.
              </p>
            </div>
            {onCancel && (
              <button onClick={onCancel} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                Cancel
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#e2e8f0' }}>
              Incident Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Stalker following lone commuter near metro exit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Category & Severity Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#e2e8f0' }}>
                Incident Category
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                <option value="pothole">🕳️ Road Pothole / Crater (YOLO Scanned)</option>
                <option value="drains">🌊 Drainage Overflow / Waterlogging</option>
                <option value="garbage">🗑️ Garbage Dump / Waste Accumulation</option>
                <option value="street_light">💡 Broken Streetlight / Blackout Stretch</option>
                <option value="harassment">⚠️ Harassment / Stalking / Catcalling</option>
                <option value="unsafe_area">🌑 Secluded / Isolated Unsafe Corridor</option>
                <option value="theft">🚨 Snatching / Robbery Hotspot</option>
                <option value="safe_zone">🛡️ Verified Safe Zone / Police Post</option>
                <option value="sos">🆘 Immediate Emergency / SOS</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#e2e8f0' }}>
                Severity Level
              </label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="input-field">
                <option value="critical">🔴 Critical (Immediate Danger / Urgent)</option>
                <option value="high">🟠 High Threat</option>
                <option value="medium">🟡 Medium Hazard</option>
                <option value="low">🟢 Low / Informational</option>
              </select>
            </div>
          </div>

          {/* Location Picker */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#e2e8f0' }}>
                Location & Coordinates
              </label>
              <button
                type="button"
                onClick={handleFetchCurrentLocation}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>
                📍 Use My Exact GPS
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Street address or landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field"
              />
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#e2e8f0' }}>
              Detailed Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe what occurred, descriptions of perpetrators or surroundings..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Live AI Risk Assessment Preview */}
          {(isAnalyzing || aiAnalysis) && (
            <div style={{
              background: aiAnalysis?.flagged ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.7)',
              border: `1px solid ${aiAnalysis?.flagged ? '#ef4444' : 'var(--border-color)'}`,
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>🧠</span> AI Threat Engine Real-time Analysis
                </span>
                {isAnalyzing ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evaluating threat score...</span>
                ) : (
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    color: aiAnalysis?.risk_score >= 0.7 ? '#ef4444' : aiAnalysis?.risk_score >= 0.5 ? '#f59e0b' : '#10b981'
                  }}>
                    Risk Score: {Math.round(aiAnalysis?.risk_score * 100)}%
                  </span>
                )}
              </div>

              {aiAnalysis && (
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {aiAnalysis.summary}
                  </p>
                  {aiAnalysis.keywords_detected?.length > 0 && (
                    <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Keywords:</span>
                      {aiAnalysis.keywords_detected.map((kw, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(244,63,94,0.2)', color: '#f43f5e', padding: '1px 6px', borderRadius: '4px' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Photo / Evidence Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#e2e8f0' }}>
              Attach Photo / Evidence (Optional)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
              />
              {photoPreview && (
                <div style={{ position: 'relative' }}>
                  <img
                    src={photoPreview}
                    alt="Preview"
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  />
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); setYoloDetection(null); }}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* YOLOv8 Scanning Indicator & Result */}
            {isDetectingImage && (
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🔍</span> Scanning image with YOLOv8 civic hazard model...
              </div>
            )}

            {yoloDetection && (
              <div style={{
                marginTop: '0.6rem',
                padding: '0.65rem 0.9rem',
                background: 'rgba(14, 165, 233, 0.12)',
                border: '1px solid rgba(14, 165, 233, 0.35)',
                borderRadius: '8px',
                fontSize: '0.78rem'
              }}>
                <div style={{ fontWeight: '700', color: '#38bdf8', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>🤖</span> YOLOv8 Vision AI Analysis
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  Detected {yoloDetection.count} hazard object(s) &bull; Severity: <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: yoloDetection.severity_assessment === 'high' ? '#ef4444' : '#f59e0b' }}>{yoloDetection.severity_assessment}</span>
                </div>
                <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {yoloDetection.detections?.map((d, i) => (
                    <span key={i} style={{ background: 'rgba(255,90,61,0.1)', padding: '2px 7px', borderRadius: '4px', fontSize: '0.72rem', color: 'var(--text-main)' }}>
                      🏷️ {d.label} ({Math.round(d.confidence * 100)}%)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Anonymous checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input
              type="checkbox"
              id="anon-check"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="anon-check" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Submit anonymously (hide your user profile identity)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem', width: '100%' }}>
            {submitting ? (
              <span>Submitting Report...</span>
            ) : (
              <span>🚀 Submit Verified Safety Report</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
