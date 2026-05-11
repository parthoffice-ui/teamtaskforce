/**
 * Reusable form field components.
 * All accept a `label`, `hint`, and spread remaining props to the native element.
 */

/** ─── Input ─── */
export function Input({ label, hint, className = '', ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input className={`form-input ${className}`} {...props} />
      {hint && <div className="form-hint">{hint}</div>}
    </div>
  );
}

/** ─── Select ─── */
export function Select({ label, children, className = '', wrapperStyle, ...props }) {
  return (
    <div className="form-group" style={wrapperStyle}>
      {label && <label className="form-label">{label}</label>}
      <select className={`form-select ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}

/** ─── Textarea ─── */
export function Textarea({ label, className = '', ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <textarea className={`form-textarea ${className}`} {...props} />
    </div>
  );
}
