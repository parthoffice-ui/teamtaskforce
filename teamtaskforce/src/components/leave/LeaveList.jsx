import { useState } from 'react';
import { Card } from '../ui/Badge.jsx';
import { Avatar } from '../ui/Badge.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Divider } from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';
import { Input, Textarea } from '../ui/Input.jsx';
import { leaveStatusColors } from '../../utils/helpers.js';
import { fmtDate, calcDays } from '../../utils/dateUtils.js';

/** ─── LeaveCard ─── */
export function LeaveCard({ leave, users, isAdmin, onApprove, onReject }) {
  const emp = users.find((u) => u.id === leave.userId);
  const lc  = leaveStatusColors(leave.status);
  const isPending = leave.status === 'Pending';

  return (
    <Card className={`leave-card ${isPending ? '' : 'mb-10'}`} style={isPending ? { border: '1.5px solid color-mix(in srgb, var(--warning) 27%, transparent)', marginBottom: 10 } : { marginBottom: 10, opacity: 0.85 }}>
      <div className="leave-card-inner">
        <div className="leave-card-left">
          <Avatar name={emp?.name || '?'} size={isPending ? 38 : 34} />
          <div>
            <div className="leave-name">{emp?.name}</div>
            <div className="leave-dates">{fmtDate(leave.fromDate)} → {fmtDate(leave.toDate)}</div>
            {isPending && (
              <div className="leave-days">{leave.days} day{leave.days > 1 ? 's' : ''}</div>
            )}
            <div className="leave-reason">
              {isPending ? `Reason: ${leave.reason}` : leave.reason}
            </div>
            {!isPending && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{leave.days}d</div>}
          </div>
        </div>

        <div className="leave-card-right">
          <Badge label={leave.status} style={lc} />
          {isAdmin && isPending && (
            <div className="leave-actions">
              <Button variant="success" size="sm" onClick={() => onApprove(leave)}>✓ Approve</Button>
              <Button variant="danger"  size="sm" onClick={() => onReject(leave)}>✗ Reject</Button>
            </div>
          )}
        </div>
      </div>
      <div className="leave-applied">Applied: {leave.appliedAt}</div>
      {leave.respondedAt && <div className="leave-applied">Responded: {leave.respondedAt}</div>}
    </Card>
  );
}

/** ─── LeaveList ─── */
export function LeaveList({ leaves, users, isAdmin, onRespond }) {
  const pending = leaves.filter((l) => l.status === 'Pending');
  const past    = leaves.filter((l) => l.status !== 'Pending');

  if (leaves.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🏖</div>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>No leave requests yet</div>
      </Card>
    );
  }

  return (
    <div>
      {pending.length > 0 && (
        <>
          <div className="section-label mb-10">Pending Requests</div>
          {pending.map((l) => (
            <LeaveCard key={l.id} leave={l} users={users} isAdmin={isAdmin}
              onApprove={(lv) => onRespond(lv, 'Approved')}
              onReject={(lv)  => onRespond(lv, 'Rejected')}
            />
          ))}
          {past.length > 0 && <Divider />}
        </>
      )}

      {past.length > 0 && (
        <>
          {pending.length > 0 && <div className="section-label mb-10">Past Requests</div>}
          {past.map((l) => (
            <LeaveCard key={l.id} leave={l} users={users} isAdmin={isAdmin}
              onApprove={() => {}} onReject={() => {}}
            />
          ))}
        </>
      )}
    </div>
  );
}

/** ─── ApplyLeaveForm (modal) ─── */
export function ApplyLeaveForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({ fromDate: '', toDate: '', reason: '' });
  const [error, setError] = useState('');
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const days = form.fromDate && form.toDate && form.fromDate <= form.toDate
    ? calcDays(form.fromDate, form.toDate)
    : null;

  const handleSubmit = () => {
    const err = onSubmit(form);
    if (err) setError(err);
    else onClose();
  };

  return (
    <Modal title="Apply for Leave" onClose={onClose}>
      {error && <p className="login-error">{error}</p>}
      <div className="form-row">
        <Input label="From Date *" type="date" value={form.fromDate} onChange={(e) => set('fromDate', e.target.value)} />
        <Input label="To Date *"   type="date" value={form.toDate}   onChange={(e) => set('toDate',   e.target.value)} />
      </div>
      {days && (
        <div style={{ padding: '10px 14px', background: 'var(--accent-bg)', border: '1.5px solid var(--border)', borderRadius: 8, marginBottom: 14, color: 'var(--primary)', fontSize: 13, fontWeight: 700 }}>
          📅 Duration: {days} day{days > 1 ? 's' : ''}
        </div>
      )}
      <Textarea label="Reason *" placeholder="Reason for leave request..." value={form.reason} onChange={(e) => set('reason', e.target.value)} />
      <div className="flex justify-end gap-10">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit Application →</Button>
      </div>
    </Modal>
  );
}
