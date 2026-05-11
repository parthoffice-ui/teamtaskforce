import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { useLeaves, useAttendance } from '../hooks/useAppHooks.js';
import { useToast } from '../hooks/useToast.js';
import { LeaveList, ApplyLeaveForm } from '../components/leave/LeaveList.jsx';
import { CheckInPanel, AdminAttendanceOverview, AttendanceHistory } from '../components/attendance/CheckInPanel.jsx';
import ReportsView from '../components/reports/ReportsView.jsx';
import { Card } from '../components/ui/Badge.jsx';
import { Avatar } from '../components/ui/Badge.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import Modal from '../components/ui/Modal.jsx';
import { Input } from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { Toast } from '../components/common/Toast.jsx';
import { isOverdue, todayStr } from '../utils/dateUtils.js';
import { rateColor } from '../utils/helpers.js';

// ─── Leave Page ──────────────────────────────────────────────────────────────
export function LeavePage() {
  const { isAdmin } = useAuth();
  const { state }   = useAppContext();
  const { myLeaves, respondToLeave, applyLeave } = useLeaves();
  const { toast, showToast } = useToast();

  const [showForm, setShowForm] = useState(false);

  const handleApply = (form) => {
    const err = applyLeave(form);
    if (err) { showToast(err, 'err'); return err; }
    showToast('Leave applied ✓');
    return null;
  };

  const handleRespond = (leave, status) => {
    respondToLeave(leave, status);
    showToast(`Leave ${status.toLowerCase()} ✓`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div className="section-sub">
          {myLeaves.length} total · {myLeaves.filter((l) => l.status === 'Pending').length} pending
        </div>
        {!isAdmin && (
          <Button size="sm" onClick={() => setShowForm(true)}>+ Apply Leave</Button>
        )}
      </div>

      <LeaveList
        leaves={myLeaves}
        users={state.users}
        isAdmin={isAdmin}
        onRespond={handleRespond}
      />

      {showForm && (
        <ApplyLeaveForm onSubmit={handleApply} onClose={() => setShowForm(false)} />
      )}

      <Toast toast={toast} isMobile={window.innerWidth < 768} />
    </div>
  );
}

// ─── Attendance Page ─────────────────────────────────────────────────────────
export function AttendancePage() {
  const { isAdmin } = useAuth();
  const { state }   = useAppContext();
  const { myAttendance, todayRecord, checkedIn, checkedOut, checkIn, checkOut } = useAttendance();
  const { toast, showToast } = useToast();

  const employees = state.users.filter((u) => u.role === 'employee');

  const handleCheckIn  = () => { checkIn();  showToast(`Checked in at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ✓`); };
  const handleCheckOut = () => { checkOut(); showToast(`Checked out ✓`); };

  return (
    <div>
      {/* Employee check-in panel */}
      {!isAdmin && (
        <CheckInPanel
          todayRecord={todayRecord}
          checkedIn={checkedIn}
          checkedOut={checkedOut}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
      )}

      {/* Admin today overview */}
      {isAdmin && (
        <AdminAttendanceOverview employees={employees} attendance={state.attendance} />
      )}

      {/* History */}
      <h3 className="section-title mb-12">
        {isAdmin ? 'Team Attendance History' : 'My Attendance History'}
      </h3>
      <AttendanceHistory records={myAttendance} users={state.users} isAdmin={isAdmin} />

      <Toast toast={toast} isMobile={window.innerWidth < 768} />
    </div>
  );
}

// ─── Reports Page (admin only) ───────────────────────────────────────────────
export function ReportsPage() {
  const { isAdmin } = useAuth();
  const { state }   = useAppContext();

  if (!isAdmin) return null;

  const employees = state.users.filter((u) => u.role === 'employee');

  return (
    <ReportsView
      tasks={state.tasks}
      attendance={state.attendance}
      employees={employees}
      users={state.users}
    />
  );
}

// ─── Team Page (admin only) ──────────────────────────────────────────────────
export function TeamPage() {
  const { isAdmin } = useAuth();
  const { state }   = useAppContext();
  const { toast, showToast } = useToast();

  const [showAdd, setShowAdd] = useState(false);
  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [error,   setError]   = useState('');

  if (!isAdmin) return null;

  const { users, tasks, attendance, leaves } = state;
  const employees = users.filter((u) => u.role === 'employee');

  // useTeam hook inline to avoid extra file
  const { dispatch } = useAppContext();

  const handleAddEmployee = () => {
    if (!form.name?.trim() || !form.email?.trim() || !form.password?.trim()) {
      setError('All fields are required'); return;
    }
    if (users.find((u) => u.email === form.email)) {
      setError('Email already registered'); return;
    }
    dispatch({
      type: 'ADD_USER',
      payload: { id: 'u' + Date.now(), name: form.name.trim(), email: form.email.trim(), password: form.password, role: 'employee' },
    });
    setShowAdd(false);
    setForm({ name: '', email: '', password: '' });
    setError('');
    showToast(`${form.name} added to team ✓`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div className="section-sub">{users.length} members ({employees.length} employees)</div>
        <Button size="sm" onClick={() => setShowAdd(true)}>+ Add Member</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {users.map((u) => {
          const ut     = tasks.filter((t) => t.assignedTo === u.id);
          const done   = ut.filter((t) => t.status === 'Done').length;
          const inprog = ut.filter((t) => t.status === 'In Progress').length;
          const pend   = ut.filter((t) => t.status === 'Pending').length;
          const rate   = ut.length ? Math.round((done / ut.length) * 100) : null;
          const att    = attendance.find((a) => a.userId === u.id && a.date === todayStr());
          const onLeave = leaves.find((l) => l.userId === u.id && l.status === 'Approved' && l.fromDate <= todayStr() && l.toDate >= todayStr());

          return (
            <Card key={u.id}>
              <div className="team-card-header">
                <Avatar name={u.name} size={44} />
                <div className="team-card-meta">
                  <div className="team-card-names-row">
                    <span className="team-card-name">{u.name}</span>
                    {u.role === 'admin' && <Badge label="👑 Boss" style={{ '--badge-color': 'var(--warning)', '--badge-bg': 'var(--warning-bg)' }} />}
                    {onLeave && <Badge label="On Leave" style={{ '--badge-color': 'var(--primary)', '--badge-bg': 'var(--primary-bg)' }} />}
                  </div>
                  <div className="team-card-email">{u.email}</div>
                  <div className="team-card-presence" style={{ color: att ? 'var(--success)' : 'var(--muted)' }}>
                    {att ? '📍 Present today' : '○ Not checked in'}
                  </div>
                </div>
                <div className="team-card-rate">
                  <div className="team-card-rate-value" style={{ color: rate !== null ? rateColor(rate) : 'var(--muted)' }}>
                    {rate !== null ? `${rate}%` : '-'}
                  </div>
                  <div className="team-card-rate-label">completion</div>
                </div>
              </div>

              <div className="team-card-badges">
                <Badge label={`✅ ${done} Done`}    style={{ '--badge-color': 'var(--success)', '--badge-bg': 'var(--success-bg)' }} />
                <Badge label={`⏳ ${inprog} Active`} style={{ '--badge-color': 'var(--warning)', '--badge-bg': 'var(--warning-bg)' }} />
                <Badge label={`🔴 ${pend} Pending`} style={{ '--badge-color': 'var(--danger)',  '--badge-bg': 'var(--danger-bg)'  }} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add employee modal */}
      {showAdd && (
        <Modal title="Add Team Member" onClose={() => { setShowAdd(false); setError(''); }}>
          {error && <p className="login-error">{error}</p>}
          <Input label="Full Name *" placeholder="Employee full name" value={form.name}     onChange={(e) => setForm((p) => ({ ...p, name:     e.target.value }))} />
          <Input label="Email *"     type="email" placeholder="employee@office.com"         value={form.email}    onChange={(e) => setForm((p) => ({ ...p, email:    e.target.value }))} />
          <Input label="Password *"  type="password" placeholder="Set login password"       value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} hint="Employee will use this to log in" />
          <div className="flex justify-end gap-10" style={{ marginTop: 4 }}>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAddEmployee}>Add Member →</Button>
          </div>
        </Modal>
      )}

      <Toast toast={toast} isMobile={window.innerWidth < 768} />
    </div>
  );
}
