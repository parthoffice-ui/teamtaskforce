import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';

export default function RegisterPage() {
  const { registerCompany, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: '',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleRegister = async () => {
    if (!form.companyName || !form.adminName || !form.email || !form.password) {
      setError('Sab fields bharo'); return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords match nahi kar rahe'); return;
    }
    if (form.password.length < 6) {
      setError('Password minimum 6 characters ka hona chahiye'); return;
    }
    setError('');
    setLoading(true);
    const result = await registerCompany(form);
    setLoading(false);
    if (result.success) navigate('/');
    else setError(result.error);
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    const ok = await loginWithGoogle();
    setLoading(false);
    if (ok) navigate('/');
    else setError('Google login failed');
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-brand">
          <div className="login-brand-icon">⚡</div>
          <div className="login-brand-name">Team Task Force</div>
          <div className="login-brand-sub">Apni company register karo — free mein!</div>
        </div>

        <div className="login-card">
          <h2 className="login-title">Company Register Karo</h2>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '16px',
              background: '#fff',
              border: '1.5px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#333',
            }}
          >
            <img
              src="https://www.google.com/favicon.ico"
              width="18" height="18"
              alt="Google"
            />
            Continue with Google
          </button>

          <div style={{
            textAlign: 'center',
            color: 'var(--muted)',
            fontSize: '12px',
            marginBottom: '16px',
          }}>
            — or register with email —
          </div>

          <Input
            label="Company Name *"
            placeholder="e.g. OfficeYard Pvt Ltd"
            value={form.companyName}
            onChange={(e) => set('companyName', e.target.value)}
          />
          <Input
            label="Your Name *"
            placeholder="Admin ka naam"
            value={form.adminName}
            onChange={(e) => set('adminName', e.target.value)}
          />
          <Input
            label="Email *"
            type="email"
            placeholder="admin@company.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
          <Input
            label="Password *"
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
          />
          <Input
            label="Confirm Password *"
            type="password"
            placeholder="Password dobara daalo"
            value={form.confirmPassword}
            onChange={(e) => set('confirmPassword', e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}

          <Button
            style={{ width: '100%', fontSize: 15, padding: 11 }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Register & Get Started →'}
          </Button>

          <div style={{
            textAlign: 'center',
            marginTop: '16px',
            color: 'var(--muted)',
            fontSize: '13px',
          }}>
            Already account hai?{' '}
            <Link
              to="/login"
              style={{ color: 'var(--primary)', fontWeight: '700' }}
            >
              Sign In →
            </Link>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'var(--success-bg)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--success)',
            textAlign: 'center',
            fontWeight: '600',
          }}>
            ✅ Free Plan — 10 users tak bilkul free!
          </div>
        </div>
      </div>
    </div>
  );
}