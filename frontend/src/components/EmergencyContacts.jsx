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
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '0 1rem 3rem 1rem' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👥</span> Trusted Emergency Contacts
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              These guardians receive one-click GPS distress messages whenever you trigger SOS.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
            {showAddForm ? '✕ Close' : '+ Add Contact'}
          </button>
        </div>

        {/* Add Contact Drawer / Form */}
        {showAddForm && (
          <form onSubmit={handleAddContact} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Add New Guardian Contact</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Papa, Sister, Rohit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Phone Number (with country code)</label>
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
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Relationship</label>
                <select value={relation} onChange={(e) => setRelation(e.target.value)} className="input-field">
                  <option value="Family">Family / Parents</option>
                  <option value="Friend">Friend / Roommate</option>
                  <option value="Partner">Spouse / Partner</option>
                  <option value="Colleague">Colleague / Work</option>
                  <option value="Security">Hostel / Campus Security</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Preferred Channel</label>
                <select value={channel} onChange={(e) => setChannel(e.target.value)} className="input-field">
                  <option value="whatsapp">WhatsApp Instant Alert</option>
                  <option value="sms">SMS Text Message</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1.25rem' }}>
              Save Guardian
            </button>
          </form>
        )}

        {/* Contacts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {contacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</p>
              <p>No emergency contacts added yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Add trusted contacts above so they can be notified in 1-click during an emergency.</p>
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
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid var(--border-color)'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(244, 63, 94, 0.15)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '1.1rem'
                    }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>{c.name}</h4>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                          {c.relation}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                        {c.phone}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                      style={{ background: '#25D366', color: '#fff', fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}>
                      💬 WhatsApp SOS
                    </a>

                    <a
                      href={smsLink}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}>
                      ✉️ SMS Alert
                    </a>

                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      title="Remove Contact"
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem' }}>
                      🗑️
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
