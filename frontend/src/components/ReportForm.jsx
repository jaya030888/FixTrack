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
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 1rem 3rem 1rem' }}>
      <div className="glass-panel" style={{ padding: '2.2rem', background: '#ffffff', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '700', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 26, color: 'var(--coral)' }}>add_a_photo</span>
                Report Road Hazard &amp; Pothole
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-55)', marginTop: '0.25rem' }}>
                Your report triggers real-time YOLOv8 damage inspection and creates a PostGIS geocoded municipal ticket.
              </p>
            </div>
            {onCancel && (
              <button onClick={onCancel} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                Cancel
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.45rem', color: 'var(--ink)' }}>
              Hazard Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Deep 8-inch pothole near Sector 15 Metro Station Pillar 42"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Category & Severity Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.45rem', color: 'var(--ink)' }}>
                Hazard Category
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.45rem', color: 'var(--ink)' }}>
                Severity Level
              </label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="input-field">
                <option value="critical">🔴 Critical (Immediate Danger / Urgent)</option>
                <option value="high">🟠 High Threat / Severe Crater</option>
                <option value="medium">🟡 Medium Hazard</option>
                <option value="low">🟢 Low / Informational</option>
              </select>
            </div>
          </div>

          {/* Location Picker */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>
                Location &amp; Coordinates
              </label>
              <button
                type="button"
                onClick={handleFetchCurrentLocation}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>my_location</span>
                <span>Use My Exact GPS</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Street address or nearest landmark..."
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
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.45rem', color: 'var(--ink)' }}>
              Detailed Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe road defect dimensions, traffic hazards, or surrounding risks..."
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
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.45rem', color: 'var(--ink)' }}>
              Attach Photo / Road Defect Snapshot (Triggers Real YOLOv8 AI Scan)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                style={{ fontSize: '0.85rem', color: 'var(--ink-70)' }}
              />
              {photoPreview && (
                <div style={{ position: 'relative' }}>
                  <img
                    src={photoPreview}
                    alt="Preview"
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}
                  />
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); setYoloDetection(null); }}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--coral)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* YOLOv8 Scanning Indicator & Result */}
            {isDetectingImage && (
              <div style={{ fontSize: '0.8rem', color: 'var(--coral)', marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: 'var(--font-mono)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, animation: 'radar-sweep 1.5s linear infinite' }}>progress_activity</span>
                <span>Scanning image with YOLOv8 neural model (best.pt)...</span>
              </div>
            )}

            {yoloDetection && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.85rem 1.1rem',
                background: 'rgba(201, 244, 90, 0.15)',
                border: '1px solid rgba(201, 244, 90, 0.6)',
                borderRadius: '10px',
                fontSize: '0.82rem'
              }}>
                <div style={{ fontWeight: '700', color: 'var(--ink)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#10b981' }}>check_circle</span>
                  <span>YOLOv8 Vision AI Analysis Complete</span>
                </div>
                <div style={{ color: 'var(--ink-70)' }}>
                  Detected {yoloDetection.count} defect object(s) &bull; Severity: <strong style={{ textTransform: 'uppercase', color: yoloDetection.severity_assessment === 'high' ? 'var(--coral)' : '#10b981' }}>{yoloDetection.severity_assessment}</strong>
                </div>
                <div style={{ marginTop: '0.45rem', display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {yoloDetection.detections?.map((d, i) => (
                    <span key={i} style={{ background: '#ffffff', border: '1px solid var(--line)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
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
              style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--coral)' }}
            />
            <label htmlFor="anon-check" style={{ fontSize: '0.85rem', color: 'var(--ink-70)', cursor: 'pointer' }}>
              Submit anonymously (hide your citizen profile name from public radar)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {submitting ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>hourglass_empty</span>
                <span>Submitting &amp; Geolocating...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>publish</span>
                <span>Submit Verified Incident Report</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
