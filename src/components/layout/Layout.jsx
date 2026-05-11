import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useNotifications } from '../../hooks/useAppHooks.js';
import { Avatar } from '../ui/Badge.jsx';
import { ADMIN_NAV, EMPLOYEE_NAV, PAGE_TITLES } from '../../utils/constants.js';

/* ─── Sidebar ─────────────────────────────────────────────────── */
export function Sidebar({ pendingLeaveCount }) {
  const { currentUser, isAdmin, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  const navItems  = isAdmin ? ADMIN_NAV : EMPLOYEE_NAV;
  const activePage = location.pathname.replace('/', '') || 'dashboard';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <div>
          <div className="sidebar-logo-title">Team Task Force</div>
          <div className="sidebar-logo-sub">Management System</div>
        </div>
      </div>

      {/* Role pill */}
      <div className="sidebar-role">
        <div
          className="sidebar-role-dot"
          style={{ background: isAdmin ? '#F5A623' : 'var(--success)' }}
        />
        <span className="sidebar-role-label">
          {isAdmin ? 'Boss / Admin' : 'Employee'}
        </span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((n) => {
          const badge  = n.id === 'leave' && isAdmin && pendingLeaveCount > 0 ? pendingLeaveCount : 0;
          const active = activePage === n.id;
          return (
            <div
              key={n.id}
              className={`sidebar-nav-item ${active ? 'active' : ''}`}
              onClick={() => navigate(`/${n.id === 'dashboard' ? '' : n.id}`)}
            >
              <span className="sidebar-nav-item-icon">{n.icon}</span>
              {n.label}
              {badge > 0 && <span className="sidebar-nav-badge">{badge}</span>}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* Dark toggle */}
        <div className="sidebar-dark-toggle">
          <span className="sidebar-dark-label">Dark Mode</span>
          <button className={`toggle-track ${dark ? 'on' : ''}`} onClick={toggleDark} aria-label="Toggle dark mode">
            <div className={`toggle-thumb ${dark ? 'on' : ''}`} />
          </button>
        </div>

        {/* User */}
        <div className="sidebar-user">
          <Avatar name={currentUser?.name || ''} size={32} />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser?.name}</div>
            <div className="sidebar-user-role">{isAdmin ? '👑 Boss' : '👤 Employee'}</div>
          </div>
        </div>

        <button className="btn-signout" onClick={logout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ─── Header ──────────────────────────────────────────────────── */
export function Header({ pendingLeaveCount, isMobile }) {
  const { isAdmin } = useAuth();
  const { dark, toggleDark } = useTheme();
  const { myNotifs, unreadCount, markRead, markAllRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activePage  = location.pathname.replace('/', '') || 'dashboard';
  const role        = isAdmin ? 'admin' : 'employee';
  const title       = PAGE_TITLES[activePage]?.[role] || 'Dashboard';
  const todayLabel  = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="header">
      <div>
        <h2 className="header-title">{title}</h2>
        <div className="header-date">{todayLabel}</div>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="btn-icon" onClick={() => setShowNotifs((p) => !p)} aria-label="Notifications">
            🔔
            {unreadCount > 0 && <span className="unread-dot">{unreadCount}</span>}
          </button>

          {showNotifs && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span className="notif-title">
                  Notifications
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </span>
                <button className="notif-mark-btn" onClick={markAllRead}>Mark all read</button>
              </div>
              {myNotifs.length === 0 ? (
                <div className="notif-empty">No notifications</div>
              ) : (
                myNotifs.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${n.read ? '' : 'unread'}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className="notif-text">{n.text}</div>
                    <div className="notif-time">{n.at}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Quick create (admin) */}
        {isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/tasks')}>
            + Task
          </button>
        )}

        {/* Dark mode (mobile only) */}
        {isMobile && (
          <button className="btn-icon" onClick={toggleDark} aria-label="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>
        )}
      </div>
    </header>
  );
}

/* ─── Bottom Nav (mobile) ─────────────────────────────────────── */
export function BottomNav({ pendingLeaveCount }) {
  const { isAdmin } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const navItems  = isAdmin ? ADMIN_NAV : EMPLOYEE_NAV;
  const activePage = location.pathname.replace('/', '') || 'dashboard';

  return (
    <nav className="bottom-nav">
      {navItems.slice(0, 5).map((n) => {
        const badge  = n.id === 'leave' && isAdmin && pendingLeaveCount > 0 ? pendingLeaveCount : 0;
        const active = activePage === n.id;
        return (
          <div
            key={n.id}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(`/${n.id === 'dashboard' ? '' : n.id}`)}
          >
            {active && <div className="bottom-nav-indicator" />}
            <span className="bottom-nav-icon">{n.icon}</span>
            <span className="bottom-nav-label">{n.label.split(' ')[0]}</span>
            {badge > 0 && <div className="bottom-nav-badge">{badge}</div>}
          </div>
        );
      })}
    </nav>
  );
}

/* ─── Layout wrapper ──────────────────────────────────────────── */
export function Layout({ children }) {
  const { leaves } = useAppContext();
  const pendingLeaveCount = leaves ? leaves.filter((l) => l.status === 'Pending').length : 0;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  return (
    <div className="app-shell">
      {!isMobile && <Sidebar pendingLeaveCount={pendingLeaveCount} />}
      <div className="main-area">
        <Header pendingLeaveCount={pendingLeaveCount} isMobile={isMobile} />
        <main className="page-content anim-fade-up">{children}</main>
        {isMobile && <BottomNav pendingLeaveCount={pendingLeaveCount} />}
      </div>
    </div>
  );
}

// Fix circular import — import here after all exports
import { useAppContext } from '../../context/AppContext.jsx';
