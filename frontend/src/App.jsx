import React, { useState, useEffect } from 'react';
import { supabase, photoBucketName } from './services/supabase';
import { 
  ShieldAlert, 
  MapPin, 
  FileText, 
  UploadCloud, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Radio,
  Image as ImageIcon
} from 'lucide-react';

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' | 'report' | 'profiles'

  // New incident form state
  const [formData, setFormData] = useState({
    type: 'unsafe_area',
    severity: 'medium',
    latitude: '12.9716',
    longitude: '77.5946',
    address: 'Central District',
    details: '',
  });

  const [beforeFile, setBeforeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Fetch incidents
  const fetchIncidents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('time', { ascending: false });

    if (!error && data) {
      setIncidents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Handle report submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setStatusMsg('');

    try {
      let beforePhotoUrl = null;

      // 1. Upload photo to Supabase 'photos' bucket if selected
      if (beforeFile) {
        const fileExt = beforeFile.name.split('.').pop();
        const fileName = `reports/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from(photoBucketName)
          .upload(fileName, beforeFile);

        if (uploadError) {
          console.warn("Storage upload notice:", uploadError.message);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from(photoBucketName)
            .getPublicUrl(fileName);
          beforePhotoUrl = publicUrlData.publicUrl;
        }
      }

      // 2. Insert into Incidents table (with PostGIS point format)
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      
      const { data: incidentData, error: incidentErr } = await supabase
        .from('incidents')
        .insert([{
          type: formData.type,
          severity: formData.severity,
          latitude: lat,
          longitude: lng,
          location: `POINT(${lng} ${lat})`,
          address: formData.address,
          status: 'open',
          confirmed_count: 1
        }])
        .select();

      if (incidentErr) throw incidentErr;

      // 3. Create linked record in Reports table
      if (incidentData && incidentData.length > 0) {
        await supabase
          .from('reports')
          .insert([{
            incident_id: incidentData[0].id,
            details: formData.details,
            before_photo: beforePhotoUrl
          }]);
      }

      setStatusMsg('Incident & Report successfully submitted!');
      setFormData({
        type: 'unsafe_area',
        severity: 'medium',
        latitude: '12.9716',
        longitude: '77.5946',
        address: 'Central District',
        details: '',
      });
      setBeforeFile(null);
      fetchIncidents();
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoRow}>
          <ShieldAlert color="#e11d48" size={32} />
          <div>
            <h1 style={styles.title}>HerHack Safety Dashboard</h1>
            <p style={styles.subtitle}>Supabase PostGIS Emergency & Incident Response Platform</p>
          </div>
        </div>
        <div style={styles.badgeRow}>
          <span style={styles.badge}><Radio size={14} style={{ marginRight: 4 }} /> Real-time PostGIS</span>
          <span style={styles.badge}><ImageIcon size={14} style={{ marginRight: 4 }} /> Bucket: photos</span>
        </div>
      </header>

      {/* Tabs */}
      <div style={styles.tabBar}>
        <button 
          style={activeTab === 'incidents' ? styles.tabBtnActive : styles.tabBtn} 
          onClick={() => setActiveTab('incidents')}
        >
          <AlertTriangle size={16} style={{ marginRight: 6 }} />
          Active Incidents ({incidents.length})
        </button>
        <button 
          style={activeTab === 'report' ? styles.tabBtnActive : styles.tabBtn} 
          onClick={() => setActiveTab('report')}
        >
          <UploadCloud size={16} style={{ marginRight: 6 }} />
          Report Incident
        </button>
      </div>

      {statusMsg && (
        <div style={{
          ...styles.alertNotice,
          backgroundColor: statusMsg.startsWith('Error') ? '#fee2e2' : '#dcfce7',
          color: statusMsg.startsWith('Error') ? '#b91c1c' : '#15803d'
        }}>
          {statusMsg}
        </div>
      )}

      {/* Content */}
      <main style={styles.main}>
        {activeTab === 'incidents' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Recent Safety Incidents</h2>
              <button onClick={fetchIncidents} style={styles.smallBtn}>Refresh</button>
            </div>

            {loading ? (
              <p>Loading incidents from Supabase...</p>
            ) : incidents.length === 0 ? (
              <div style={styles.emptyCard}>
                <CheckCircle size={40} color="#10b981" />
                <p style={{ marginTop: '0.5rem' }}>No active incidents logged yet. Create one via the Report tab.</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {incidents.map((item) => (
                  <div key={item.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <span style={{
                        ...styles.severityTag,
                        backgroundColor: item.severity === 'high' || item.severity === 'critical' ? '#ffe4e6' : '#fef3c7',
                        color: item.severity === 'high' || item.severity === 'critical' ? '#e11d48' : '#d97706'
                      }}>
                        {item.severity.toUpperCase()}
                      </span>
                      <span style={styles.statusTag}>{item.status}</span>
                    </div>

                    <h3 style={{ margin: '0.5rem 0', textTransform: 'capitalize' }}>{item.type.replace('_', ' ')}</h3>
                    
                    <p style={styles.cardAddress}>
                      <MapPin size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      {item.address || `${item.latitude}, ${item.longitude}`}
                    </p>

                    <div style={styles.cardFooter}>
                      <small>Confirmed: {item.confirmed_count || 1}</small>
                      <small>{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'report' && (
          <section style={styles.formCard}>
            <h2>Submit Incident & Evidence Report</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Adds record to <code>incidents</code> with PostGIS coordinates, creates <code>reports</code> record, and uploads photo to Supabase <code>photos</code> bucket.
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Incident Type</label>
                <select 
                  value={formData.type} 
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={styles.input}
                >
                  <option value="unsafe_area">Unsafe Area</option>
                  <option value="harassment">Harassment</option>
                  <option value="theft">Theft</option>
                  <option value="sos">Emergency / SOS</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Severity</label>
                <select 
                  value={formData.severity} 
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  style={styles.input}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, ...styles.inputGroup }}>
                  <label style={styles.label}>Latitude</label>
                  <input 
                    type="number" 
                    step="any"
                    value={formData.latitude} 
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={{ flex: 1, ...styles.inputGroup }}>
                  <label style={styles.label}>Longitude</label>
                  <input 
                    type="number" 
                    step="any"
                    value={formData.longitude} 
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Location Address / Landmark</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. 5th Cross, Metro Station Road"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Details & Notes</label>
                <textarea 
                  rows={3}
                  value={formData.details} 
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  style={styles.input}
                  placeholder="Describe what occurred or hazard observed..."
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Attach Photo (Uploaded to Supabase photos bucket)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setBeforeFile(e.target.files[0] || null)}
                  style={{ marginTop: '0.25rem' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={uploading} 
                style={styles.submitBtn}
              >
                {uploading ? 'Uploading & Saving to Supabase...' : 'Submit Safety Report'}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '2rem 1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#0f172a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '1.25rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  subtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: '0.9rem',
  },
  badgeRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  badge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '0.35rem 0.65rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
  },
  tabBar: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontWeight: '500',
  },
  tabBtnActive: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: '1px solid #0284c7',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: '500',
  },
  alertNotice: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  main: {
    marginTop: '1rem',
  },
  smallBtn: {
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '1.2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  severityTag: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
  },
  statusTag: {
    fontSize: '0.75rem',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  cardAddress: {
    fontSize: '0.85rem',
    color: '#475569',
    margin: '0.5rem 0',
  },
  cardFooter: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '0.5rem',
    marginTop: '0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#94a3b8',
    fontSize: '0.75rem',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '3rem 1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1',
    color: '#64748b',
  },
  formCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.75rem',
    maxWidth: '600px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '0.55rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '0.9rem',
    outline: 'none',
  },
  submitBtn: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    backgroundColor: '#e11d48',
    color: '#ffffff',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
};
