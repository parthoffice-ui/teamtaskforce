import { getInitials, getAvatarColor } from '../../utils/helpers.js';

/** ─── Badge ─── */
export function Badge({ label, style: s, className = '' }) {
  return (
    <span className={`badge ${className}`} style={s}>
      {label}
    </span>
  );
}

/** ─── Avatar ─── */
export function Avatar({ name = '', size = 34 }) {
  const color = getAvatarColor(name);
  return (
    <div
      className="avatar"
      style={{ '--ava-color': color, '--ava-size': `${size}px` }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}

/** ─── Card ─── */
export function Card({ children, className = '', style: s }) {
  return (
    <div className={`card ${className}`} style={s}>
      {children}
    </div>
  );
}

/** ─── StatCard ─── */
export function StatCard({ label, value, icon, accentColor, sub, onClick }) {
  return (
    <div
      className="stat-card"
      style={{ '--accent-color': accentColor, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="stat-card-label">{label}</div>
          <div className="stat-card-value">{value}</div>
          {sub && <div className="stat-card-sub">{sub}</div>}
        </div>
        <div style={{ fontSize: 18, opacity: 0.45 }}>{icon}</div>
      </div>
    </div>
  );
}

/** ─── Divider ─── */
export function Divider() {
  return <div className="divider" />;
}
