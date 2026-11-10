import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { User, Shield, CheckCircle, LogOut, Award, AlertCircle } from 'lucide-react';

// Pre-configured demo accounts for judges and quick testing
export const DEMO_ACCOUNTS = {
  citizen: {
    id: 'demo-citizen-01',
    name: 'Ananya Sharma (Citizen)',
    email: 'citizen@fix-track.org',
    role: 'citizen',
    civic_score: 145,
    badge: '🏆 Senior Civic Guardian'
  },
  authority: {
    id: 'demo-authority-01',
    name: 'Inspector Rajesh Verma (Authority)',
    email: 'authority@bbmp.gov.in',
    role: 'authority',
    civic_score: 500,
    badge: '🛡️ Municipal Road Inspector'
  }
};

export default function AuthBar({ currentUser, onUserChange }) {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState('demo'); // 'demo' | 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Switch demo account
  const selectDemoAccount = (role) => {
    const user = DEMO_ACCOUNTS[role];
    localStorage.setItem('fixtrack_user', JSON.stringify(user));
    onUserChange(user);
    setShowModal(false);
  };

  // Real Supabase Auth login
  const handleSupabaseLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const loggedInUser = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
          email: data.user.email,
          role: data.user.user_metadata?.role || 'citizen',
          civic_score: 120,
          badge: 'Verified Citizen'
        };
        localStorage.setItem('fixtrack_user', JSON.stringify(loggedInUser));
        onUserChange(loggedInUser);
        setShowModal(false);
      }
    } catch (err) {
      setMsg(err.message || 'Login failed. You can use the instant 1-Click Demo accounts below.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fixtrack_user');
    onUserChange(DEMO_ACCOUNTS.citizen);
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      padding: '0 0.65rem',
      height: '34px',
      borderRadius: '999px',
      border: '1px solid var(--line)',
      fontSize: '0.74rem',
      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
    onClick={() => setShowModal(true)}
    title="Click to Switch Demo Account / Authority Role">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {currentUser?.role === 'authority' ? (
          <Shield size={14} color="#0284c7" />
        ) : (
          <User size={14} color="var(--coral)" />
        )}
        <span style={{ fontWeight: '600', color: 'var(--ink)' }}>
          {currentUser?.name ? currentUser.name.split(' (')[0] : 'Ananya Sharma'}
        </span>
      </div>

      {currentUser?.role === 'citizen' && (
        <span style={{
          backgroundColor: '#fef3c7',
          color: '#b45309',
          padding: '2px 7px',
          borderRadius: '999px',
          fontWeight: '700',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem'
        }}>
          <Award size={11} /> {currentUser.civic_score || 145}p
        </span>
      )}

      {currentUser?.role === 'authority' && (
        <span style={{
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
          padding: '2px 7px',
          borderRadius: '999px',
          fontWeight: '700',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)'
        }}>
          Admin
        </span>
      )}

      <span style={{
        fontSize: '0.66rem',
        color: 'var(--ink-55)',
        background: 'rgba(23, 21, 26, 0.05)',
        padding: '2px 6px',
        borderRadius: '999px',
        fontWeight: 600,
        marginLeft: '0.1rem'
      }}>
        Switch
      </span>

      {/* Account Switch Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.75rem',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Select Account / Role</h3>
            <p style={{ margin: '0 0 1.25rem 0', color: '#64748b', fontSize: '0.85rem' }}>
              Switch roles to test citizen reporting or authority resolution verification.
            </p>

            {/* 1-Click Demo Accounts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                onClick={() => selectDemoAccount('citizen')}
                style={{
                  border: currentUser?.role === 'citizen' ? '2px solid #e11d48' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  backgroundColor: currentUser?.role === 'citizen' ? '#fff1f2' : '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Ananya Sharma (Citizen)</strong>
                  <span style={{ color: '#b45309', fontWeight: 600 }}>145 Civic Pts</span>
                </div>
                <small style={{ color: '#64748b' }}>Reports road hazards & SafeWalk guardian</small>
              </div>

              <div
                onClick={() => selectDemoAccount('authority')}
                style={{
                  border: currentUser?.role === 'authority' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  backgroundColor: currentUser?.role === 'authority' ? '#f0f9ff' : '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Inspector Rajesh Verma (Authority)</strong>
                  <span style={{ color: '#0369a1', fontWeight: 600 }}>Municipal Officer</span>
                </div>
                <small style={{ color: '#64748b' }}>Uploads after-repair photos & resolves disputed issues</small>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

