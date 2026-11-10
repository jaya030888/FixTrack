import React, { useState, useEffect } from 'react';

const DEFAULT_CONTACTS = [
  { id: 'c1', name: 'Maa / Home', phone: '+919876543210', relation: 'Family', channel: 'whatsapp' },
  { id: 'c2', name: 'Pooja (Best Friend)', phone: '+919812345678', relation: 'Friend', channel: 'whatsapp' }
];

export default function EmergencyContacts({ userLocation }) {
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('fixtrack_contacts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_CONTACTS;
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Family');
  const [channel, setChannel] = useState('whatsapp');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('fixtrack_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please provide name and phone number');
      return;
    }
    const newContact = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      relation,
      channel
    };
    setContacts([...contacts, newContact]);
    setName('');
    setPhone('');
    setShowAddForm(false);
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const getEmergencyMessage = () => {
    const lat = userLocation?.latitude || 28.6139;
    const lng = userLocation?.longitude || 77.2090;
    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    return encodeURIComponent(`🚨 EMERGENCY ALERT! I am using FixTrack and need urgent help. My current GPS location is: ${mapsLink}`);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 1rem 3rem 1rem' }}>
      <div className="glass-panel" style={{ padding: '2.2rem', background: '#ffffff', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid var(--line)', paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '700', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26, color: 'var(--coral)' }}>groups</span>
              <span>Trusted Guardian Network</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-55)', marginTop: '0.25rem' }}>
              These verified emergency contacts receive instant GPS distress beacons with live coordinates when SOS is triggered.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showAddForm ? 'close' : 'person_add'}</span>
            <span>{showAddForm ? 'Close' : 'Add Guardian'}</span>
          </button>
        </div>

        {/* Add Contact Drawer / Form */}
        {showAddForm && (
          <form onSubmit={handleAddContact} style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--line)', marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Add New Guardian Contact</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--ink-70)', marginBottom: '0.4rem', fontWeight: 600 }}>Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Papa, Sister, Pooja"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--ink-70)', marginBottom: '0.4rem', fontWeight: 600 }}>Phone Number (with Country Code)</label>
                <input
                  type="tel"
                  placeholder="+919876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--ink-70)', marginBottom: '0.4rem', fontWeight: 600 }}>Relationship</label>
                <select value={relation} onChange={(e) => setRelation(e.target.value)} className="input-field">
                  <option value="Family">Family / Parents</option>
                  <option value="Friend">Friend / Roommate</option>
                  <option value="Partner">Spouse / Partner</option>
                  <option value="Colleague">Colleague / Work</option>
                  <option value="Security">Hostel / Campus Security</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--ink-70)', marginBottom: '0.4rem', fontWeight: 600 }}>Preferred Channel</label>
                <select value={channel} onChange={(e) => setChannel(e.target.value)} className="input-field">
                  <option value="whatsapp">WhatsApp Instant Alert</option>
                  <option value="sms">SMS Text Message</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.65rem 1.5rem' }}>
              Save Guardian Contact
            </button>
          </form>
        )}

        {/* Contacts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {contacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--ink-55)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 44, color: 'var(--coral)', marginBottom: '0.5rem' }}>shield</span>
              <p style={{ fontWeight: 600 }}>No emergency contacts added yet.</p>
              <p style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>Add trusted contacts above so they can be notified in 1-click during an emergency.</p>
            </div>
          ) : (
            contacts.map(c => {
              const cleanPhone = c.phone.replace(/[^0-9]/g, '');
              const waLink = `https://wa.me/${cleanPhone}?text=${getEmergencyMessage()}`;
              const smsLink = `sms:${c.phone}?body=${getEmergencyMessage()}`;

              return (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    padding: '1.1rem 1.4rem',
                    borderRadius: '12px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--line)',
                    transition: 'all 0.2s ease'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'rgba(255, 90, 61, 0.12)',
                      color: 'var(--coral)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '1.2rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--ink)' }}>{c.name}</h4>
                        <span style={{ fontSize: '0.72rem', background: 'var(--bg-secondary)', border: '1px solid var(--line)', padding: '2px 8px', borderRadius: 999, color: 'var(--ink-70)', fontWeight: 600 }}>
                          {c.relation}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--ink-55)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                        {c.phone}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                      style={{ background: '#25D366', color: '#fff', fontSize: '0.78rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', border: 'none' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chat</span>
                      <span>WhatsApp SOS</span>
                    </a>

                    <a
                      href={smsLink}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sms</span>
                      <span>SMS Alert</span>
                    </a>

                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      title="Remove Contact"
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}

