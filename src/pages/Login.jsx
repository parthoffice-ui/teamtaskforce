import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

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
    else    setError('Invalid email or password');
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
        </div>
      </div>
    </div>
  );
}