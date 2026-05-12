import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError('Email aur password daalo'); return; }
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate('/');
    else setError('Invalid email or password');
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    const ok = await loginWithGoogle();
    setLoading(false);
    if (ok) navigate('/');
    else setError('Google login failed — try again');
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-brand">
          <div className="login-brand-icon">⚡</div>
          <div className="login-brand-name">Team Task Force</div>
          <div className="login-brand-sub">Office Task Management System</div>
        </div>

        <div className="login-card">
          <h2 className="login-title">Sign In</h2>

          {/* Google Login */}
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
            — or sign in with email —
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="your@office.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          {error && <p className="login-error">{error}</p>}

          <Button
            style={{ width: '100%', fontSize: 15, padding: 11 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </Button>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '16px',
            color: 'var(--muted)',
            fontSize: '13px',
          }}>
            Company nahi hai?{' '}
            <Link 
              to="/register" 
              style={{ color: 'var(--primary)', fontWeight: '700' }}
            >
              Register karo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}