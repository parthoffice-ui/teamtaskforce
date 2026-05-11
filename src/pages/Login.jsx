import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import Button from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';

const DEMO_ACCOUNTS = [
  { label: '👑 Boss (Admin)', email: 'bhargav@office.com', pwd: 'boss123' },
  { label: '👤 Parth',        email: 'parth@office.com',   pwd: 'parth123' },
  { label: '👤 Urvil',        email: 'urvil@office.com',   pwd: 'urvil123' },
  { label: '👤 Yadav Ji',     email: 'yadav@office.com',   pwd: 'yadav123' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const { state } = useAppContext();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const handleLogin = () => {
    setError('');
    const ok = login(state.users, email, password);
    if (ok) navigate('/');
    else    setError('Invalid email or password');
  };

  const fillDemo = (d) => {
    setEmail(d.email);
    setPassword(d.pwd);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">⚡</div>
          <div className="login-brand-name">Team Task Force</div>
          <div className="login-brand-sub">Office Task Management System</div>
        </div>

        {/* Card */}
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

          <Button style={{ width: '100%', fontSize: 15, padding: 11 }} onClick={handleLogin}>
            Sign In →
          </Button>

          {/* Demo accounts */}
          <div className="demo-accounts">
            <div className="demo-label">Quick Demo Access</div>
            {DEMO_ACCOUNTS.map((d) => (
              <div key={d.email} className="demo-item" onClick={() => fillDemo(d)}>
                <div className="demo-item-name">{d.label}</div>
                <div className="demo-item-creds">{d.email} · {d.pwd}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
