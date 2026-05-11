import Button from '../ui/Button.jsx';

/** ─── Toast notification ─── */
export function Toast({ toast, isMobile }) {
  if (!toast) return null;
  return (
    <div
      className={`toast toast-${toast.type} ${isMobile ? 'toast-mobile' : ''}`}
      role="alert"
    >
      {toast.msg}
    </div>
  );
}

/** ─── Empty state placeholder ─── */
export function EmptyState({ icon = '📭', text = 'Nothing here yet', children }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-text">{text}</div>
      {children}
    </div>
  );
}

/** ─── Delete confirmation dialog ─── */
export function DeleteConfirm({ item, onConfirm, onCancel }) {
  if (!item) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="delete-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="delete-dialog-icon">🗑️</div>
        <h3 className="delete-dialog-title">Delete Task?</h3>
        <p className="delete-dialog-text">
          "{item.title}" will be permanently deleted.
        </p>
        <div className="delete-dialog-btns">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={() => onConfirm(item)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

/** ─── Section header with optional action ─── */
export function SectionHeader({ title, sub, action }) {
  return (
    <div className="section-header mb-12">
      <div>
        <div className="section-title">{title}</div>
        {sub && <div className="section-sub">{sub}</div>}
      </div>
      {action}
    </div>
  );
}

/** ─── Alert banner ─── */
export function Alert({ type = 'danger', icon, children }) {
  return (
    <div className={`alert alert-${type}`}>
      {icon && <span className="alert-icon">{icon}</span>}
      <span className="alert-text">{children}</span>
    </div>
  );
}
