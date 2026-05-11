import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { useAttendance } from '../hooks/useAppHooks.js';
import { DashboardStats, TeamPerformance, RecentTasks } from '../components/dashboard/DashboardStats.jsx';
import { Card } from '../components/ui/Badge.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Avatar } from '../components/ui/Badge.jsx';
import { Alert } from '../components/common/Toast.jsx';
import { DeleteConfirm } from '../components/common/Toast.jsx';
import { ViewTaskModal, UpdateTaskForm, EditTaskForm } from '../components/tasks/TaskForms.jsx';
import Button from '../components/ui/Button.jsx';
import { isOverdue, todayStr } from '../utils/dateUtils.js';
import { useToast } from '../hooks/useToast.js';
import { Toast } from '../components/common/Toast.jsx';

export default function DashboardPage() {
  const { currentUser, isAdmin } = useAuth();
  const { state }  = useAppContext();
  const { visibleTasks, updateTask, editTask, deleteTask } = useTasks();
  const { checkedIn, checkedOut, todayRecord, checkIn, checkOut } = useAttendance();
  const { toast, showToast } = useToast();
  const navigate   = useNavigate();

  const [modal,   setModal]   = useState(null); // 'view' | 'update' | 'edit'
  const [selTask, setSelTask] = useState(null);
  const [delConf, setDelConf] = useState(null);
  const [isMobile] = useState(window.innerWidth < 768);

  const { users, leaves, attendance } = state;
  const employees  = users.filter((u) => u.role === 'employee');
  const scopedTasks = visibleTasks;
  const overdueTasks = scopedTasks.filter((t) => isOverdue(t.deadline, t.status));
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');

  const openView   = (t) => { setSelTask(t); setModal('view');   };
  const openUpdate = (t) => { setSelTask(t); setModal('update'); };
  const openEdit   = (t) => { setSelTask(t); setModal('edit');   };
  const closeModal = ()  => { setModal(null); setSelTask(null);  };

  const handleUpdate = (task, form) => {
    updateTask(task, form);
    showToast('Task updated ✓');
    closeModal();
  };

  const handleEdit = (task, form) => {
    const err = editTask(task, form);
    if (err) { showToast(err, 'err'); return; }
    showToast('Task saved ✓');
    closeModal();
  };

  const handleDelete = (task) => {
    deleteTask(task.id);
    setDelConf(null);
    showToast('Task deleted', 'del');
  };

  const handleCheckIn  = () => { checkIn();  showToast(`Checked in ✓`);  };
  const handleCheckOut = () => { checkOut(); showToast(`Checked out ✓`); };

  return (
    <div>
      {/* Overdue alert */}
      {overdueTasks.length > 0 && (
        <Alert type="danger" icon="⚠️">
          {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''} need urgent attention
        </Alert>
      )}

      {/* Stats */}
      <DashboardStats tasks={scopedTasks} />

      {/* Team performance (admin) */}
      {isAdmin && employees.length > 0 && (
        <TeamPerformance employees={employees} tasks={state.tasks} />
      )}

      {/* Attendance widget */}
      <Card className="mb-16">
        <div className="section-header mb-12">
          <h3 className="section-title">Today's Attendance</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/attendance')}>View All →</Button>
        </div>

        <div className="attendance-panel">
          <div className={`att-time-box ${checkedIn ? 'checked' : ''}`}>
            <div className="att-time-label">Check In</div>
            <div className={`att-time-value ${checkedIn ? 'checked' : 'pending'}`}>
              {todayRecord?.checkIn || '—:—'}
            </div>
          </div>
          <div className={`att-time-box ${checkedOut ? 'checked' : ''}`}>
            <div className="att-time-label">Check Out</div>
            <div className={`att-time-value ${checkedOut ? 'checked' : 'pending'}`}>
              {todayRecord?.checkOut || '—:—'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {!checkedIn && <Button variant="success" size="sm" onClick={handleCheckIn}>Check In</Button>}
            {checkedIn && !checkedOut && <Button variant="warn" size="sm" onClick={handleCheckOut}>Check Out</Button>}
            {checkedIn && checkedOut && (
              <Badge label={todayRecord.duration} style={{ '--badge-color': 'var(--success)', '--badge-bg': 'var(--success-bg)' }} />
            )}
          </div>
        </div>

        {/* Admin: show each employee pill */}
        {isAdmin && (
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {employees.map((e) => {
              const att = attendance.find((a) => a.userId === e.id && a.date === todayStr());
              return (
                <div key={e.id} className={`emp-att-pill ${att ? 'present' : 'absent'}`}>
                  {att ? '✓' : '✗'} {e.name}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Pending leaves alert (admin) */}
      {isAdmin && pendingLeaves.length > 0 && (
        <Card className="mb-16" style={{ border: '1.5px solid color-mix(in srgb, var(--warning) 33%, transparent)' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <span style={{ fontSize: 16 }}>🏖</span>
              <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>
                {pendingLeaves.length} pending leave request{pendingLeaves.length > 1 ? 's' : ''} awaiting approval
              </span>
            </div>
            <Button variant="warn" size="sm" onClick={() => navigate('/leave')}>Review →</Button>
          </div>
        </Card>
      )}

      {/* Recent tasks */}
      <RecentTasks
        tasks={scopedTasks}
        users={users}
        onView={openView}
        onUpdate={openUpdate}
        onEdit={openEdit}
        onDelete={setDelConf}
        onViewAll={() => navigate('/tasks')}
        isAdmin={isAdmin}
      />

      {/* Modals */}
      {modal === 'view' && selTask && (
        <ViewTaskModal
          task={selTask} users={users} isAdmin={isAdmin} currentUserId={currentUser?.id}
          onView={openView} onUpdate={openUpdate} onEdit={openEdit}
          onDelete={setDelConf} onClose={closeModal}
        />
      )}
      {modal === 'update' && selTask && (
        <UpdateTaskForm task={selTask} onSubmit={handleUpdate} onBack={() => setModal('view')} onClose={closeModal} />
      )}
      {modal === 'edit' && selTask && (
        <EditTaskForm task={selTask} employees={employees} onSubmit={handleEdit} onClose={closeModal} />
      )}

      <DeleteConfirm item={delConf} onConfirm={handleDelete} onCancel={() => setDelConf(null)} />
      <Toast toast={toast} isMobile={isMobile} />
    </div>
  );
}
