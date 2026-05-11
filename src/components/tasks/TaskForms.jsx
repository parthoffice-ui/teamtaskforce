import { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { Input, Select, Textarea } from '../ui/Input.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Avatar } from '../ui/Badge.jsx';
import { statusColors, priorityColors } from '../../utils/helpers.js';
import { isOverdue, fmtDate } from '../../utils/dateUtils.js';

/* ─── CreateTaskForm (shared by Admin modal + Employee page) ─── */
export function CreateTaskForm({ assignableUsers, onSubmit, onCancel, isModal = false }) {
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', priority: 'Medium', deadline: '' });
  const [error, setError] = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const err = onSubmit(form);
    if (err) setError(err);
  };

  const body = (
    <>
      {error && <p className="login-error">{error}</p>}
      <Input label="Task Title *" placeholder="Describe the task briefly..." value={form.title} onChange={(e) => set('title', e.target.value)} />
      <Textarea label="Description" placeholder="Detailed description..." value={form.description} onChange={(e) => set('description', e.target.value)} />
      <Select label="Assign To *" value={form.assignedTo} onChange={(e) => set('assignedTo', e.target.value)}>
        <option value="">Select team member...</option>
        {assignableUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
      </Select>
      <div className="form-row">
        <Select label="Priority" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
          <option>High</option><option>Medium</option><option>Low</option>
        </Select>
        <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
      </div>
      <div className="flex justify-end gap-10" style={{ marginTop: 4 }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Create Task →</Button>
      </div>
    </>
  );

  if (isModal) {
    return <Modal title="Create New Task" onClose={onCancel}>{body}</Modal>;
  }

  return (
    <div className="card" style={{ maxWidth: 500 }}>
      <h3 className="section-title mb-18">Create New Task</h3>
      {body}
    </div>
  );
}

/* ─── EditTaskForm (Admin) ─── */
export function EditTaskForm({ task, employees, onSubmit, onClose }) {
  const [form, setForm] = useState({
    title: task.title, description: task.description,
    assignedTo: task.assignedTo, priority: task.priority,
    deadline: task.deadline, status: task.status,
  });
  const [error, setError] = useState('');
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const err = onSubmit(task, form);
    if (err) setError(err);
    else onClose();
  };

  return (
    <Modal title="Edit Task" onClose={onClose}>
      {error && <p className="login-error">{error}</p>}
      <Input label="Title *" value={form.title} onChange={(e) => set('title', e.target.value)} />
      <Textarea label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} />
      <Select label="Assign To" value={form.assignedTo} onChange={(e) => set('assignedTo', e.target.value)}>
        {employees.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
      </Select>
      <div className="form-row">
        <Select label="Priority" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
          <option>High</option><option>Medium</option><option>Low</option>
        </Select>
        <Select label="Status" value={form.status} onChange={(e) => set('status', e.target.value)}>
          <option>Pending</option><option>In Progress</option><option>Done</option>
        </Select>
      </div>
      <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
      <div className="flex justify-end gap-10" style={{ marginTop: 4 }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Changes →</Button>
      </div>
    </Modal>
  );
}

/* ─── UpdateTaskForm (Employee) ─── */
export function UpdateTaskForm({ task, onSubmit, onBack, onClose }) {
  const [form, setForm] = useState({ status: task.status, comment: '', reason: '' });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Modal title={`Update: ${task.title.slice(0, 40)}${task.title.length > 40 ? '…' : ''}`} onClose={onClose}>
      <Select label="Status" value={form.status} onChange={(e) => set('status', e.target.value)}>
        <option>Pending</option><option>In Progress</option><option>Done</option>
      </Select>
      <Textarea label="Comment / Progress Update" placeholder="Share your progress, blockers, or notes..." value={form.comment} onChange={(e) => set('comment', e.target.value)} />
      <Textarea label="Reason (optional)" placeholder="Reason for status change, delay, etc." value={form.reason} onChange={(e) => set('reason', e.target.value)} />
      <div className="flex justify-end gap-10">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={() => { onSubmit(task, form); onClose(); }}>Save Update →</Button>
      </div>
    </Modal>
  );
}

/* ─── ViewTaskModal ─── */
export function ViewTaskModal({ task, users, onUpdate, onEdit, onDelete, onClose, isAdmin, currentUserId }) {
  const assignee = users.find((u) => u.id === task.assignedTo);
  const assigner = users.find((u) => u.id === task.assignedBy);
  const overdue   = isOverdue(task.deadline, task.status);
  const canUpdate = !isAdmin && task.assignedTo === currentUserId;

  return (
    <Modal title="Task Details" onClose={onClose} wide>
      <h2 className="task-detail-title">{task.title}</h2>

      <div className="task-detail-badges">
        <Badge label={task.status}   style={statusColors(task.status)}   />
        <Badge label={task.priority} style={priorityColors(task.priority)} />
        {overdue && <Badge label="⚠ OVERDUE" style={{ '--badge-color': 'var(--danger)', '--badge-bg': 'var(--danger-bg)' }} />}
      </div>

      {task.description && <p className="task-detail-desc">{task.description}</p>}

      <div className="task-meta-grid">
        <div className="task-meta-item">
          <div className="task-meta-label">Assigned To</div>
          <div className="task-meta-value">
            {assignee && <Avatar name={assignee.name} size={18} />}
            {assignee?.name || '—'}
          </div>
        </div>
        <div className="task-meta-item">
          <div className="task-meta-label">Assigned By</div>
          <div className="task-meta-value">{assigner?.name || '—'}</div>
        </div>
        <div className="task-meta-item">
          <div className="task-meta-label">Deadline</div>
          <div className={`task-meta-value ${overdue ? 'overdue' : ''}`}>
            {task.deadline ? fmtDate(task.deadline) : '—'}
          </div>
        </div>
        <div className="task-meta-item">
          <div className="task-meta-label">Created</div>
          <div className="task-meta-value">{fmtDate(task.createdAt)}</div>
        </div>
      </div>

      {/* Comments */}
      {task.comments?.length > 0 && (
        <div className="comments-section mb-18">
          <div className="section-label">Comments & Updates ({task.comments.length})</div>
          {task.comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{c.byName}</span>
                <span className="comment-time">{c.at}</span>
              </div>
              <div className="comment-text">{c.text}</div>
              {c.reason && <div className="comment-reason">Reason: {c.reason}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Activity Log */}
      <div className="activity-log mb-18">
        <div className="section-label">Activity Log</div>
        {task.history?.map((h, i) => (
          <div key={i} className="activity-item">
            <div className="activity-dot" />
            <div className="activity-text">
              {h.action}
              <span className="activity-meta"> · {h.by} · {h.at}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-10">
        {canUpdate && (
          <Button variant="success" onClick={() => onUpdate(task)}>Update Task</Button>
        )}
        {isAdmin && (
          <>
            <Button variant="outline" onClick={() => onEdit(task)}>Edit</Button>
            <Button variant="danger" onClick={() => { onClose(); onDelete(task); }}>Delete</Button>
          </>
        )}
      </div>
    </Modal>
  );
}
