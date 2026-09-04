'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Mail, Lock, Loader, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_email', email);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="login-container" id="admin-login" style={{ position: 'relative', zIndex: 10 }}>
        <div 
          className="card login-card animate-scale-in"
          style={{ 
            background: '#ffffff', 
            border: '2px solid #cbd5e1', 
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
            borderRadius: '1.25rem'
          }}
        >
          <div className="card-body" style={{ padding: '2.5rem' }}>
            <div className="login-header">
              <div style={{ 
                width: 56, 
                height: 56, 
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
              }}>
                <Shield size={28} color="white" />
              </div>
              <h1 style={{ color: '#0f172a', fontWeight: 900, fontSize: '1.8rem' }}>Admin Login</h1>
              <p style={{ color: '#1e293b', fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Sign in to manage graduation projects
              </p>
            </div>

            {error && (
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: '#fee2e2', 
                border: '2px solid #fca5a5',
                borderRadius: '0.75rem',
                color: '#991b1b',
                fontSize: '0.9rem',
                fontWeight: 800,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label htmlFor="login-email" style={{ color: '#0f172a', fontWeight: 800 }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ 
                    position: 'absolute', 
                    left: '1rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#475569' 
                  }} />
                  <input
                    type="email"
                    className="input"
                    style={{ paddingLeft: '2.75rem', background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                    placeholder="admin@eru.edu.eg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="login-email"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="login-password" style={{ color: '#0f172a', fontWeight: 800 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ 
                    position: 'absolute', 
                    left: '1rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#475569' 
                  }} />
                  <input
                    type="password"
                    className="input"
                    style={{ paddingLeft: '2.75rem', background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    id="login-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%', marginTop: '0.75rem' }}
                id="login-submit"
              >
                {loading ? (
                  <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</>
                ) : (
                  <><Shield size={18} /> Sign In</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
