import { StatCard } from '../ui/Badge.jsx';
import { Avatar } from '../ui/Badge.jsx';
import { Card } from '../ui/Badge.jsx';
import { rateColor } from '../../utils/helpers.js';
import { isOverdue } from '../../utils/dateUtils.js';
import TaskCard from '../tasks/TaskCard.jsx';
import Button from '../ui/Button.jsx';

/** ─── DashboardStats ─── */
export function DashboardStats({ tasks }) {
  const done       = tasks.filter((t) => t.status === 'Done').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const pending    = tasks.filter((t) => t.status === 'Pending').length;
  const rate       = tasks.length ? Math.round((done / tasks.length) * 100) : null;

  return (
    <div className="stats-grid">
      <StatCard label="Total"       value={tasks.length} icon="📋" accentColor="var(--primary)" />
      <StatCard label="Done"        value={done}         icon="✅" accentColor="var(--success)" sub={rate !== null ? `${rate}% rate` : '—'} />
      <StatCard label="In Progress" value={inProgress}   icon="⏳" accentColor="var(--warning)" />
      <StatCard label="Pending"     value={pending}      icon="🔴" accentColor="var(--danger)"  />
    </div>
  );
}

/** ─── TeamPerformance (admin only) ─── */
export function TeamPerformance({ employees, tasks }) {
  const stats = employees.map((e) => {
    const et   = tasks.filter((t) => t.assignedTo === e.id);
    const done = et.filter((t) => t.status === 'Done').length;
    const rate = et.length ? Math.round((done / et.length) * 100) : 0;
    return { ...e, total: et.length, done, rate };
  });

  return (
    <Card className="mb-16">
      <h3 className="section-title mb-14">Team Performance</h3>
      {stats.map((e) => (
        <div key={e.id} className="team-perf-row">
          <Avatar name={e.name} size={32} />
          <div className="team-perf-info">
            <div className="team-perf-name">{e.name}</div>
            <div className="team-perf-sub">{e.done}/{e.total} completed</div>
          </div>
          <div className="team-perf-bar">
            <div className="team-perf-track">
              <div
                className="perf-bar-fill"
                style={{ '--bar-width': `${e.rate}%`, background: rateColor(e.rate) }}
              />
            </div>
          </div>
          <span className="team-perf-rate" style={{ color: rateColor(e.rate) }}>
            {e.rate}%
          </span>
        </div>
      ))}
    </Card>
  );
}

/** ─── RecentTasks ─── */
export function RecentTasks({ tasks, users, onView, onUpdate, onEdit, onDelete, onViewAll, isAdmin }) {
  return (
    <Card>
      <div className="section-header mb-12">
        <h3 className="section-title">Recent Tasks</h3>
        <Button variant="ghost" size="sm" onClick={onViewAll}>View All →</Button>
      </div>
      {tasks.slice(0, 5).map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          users={users}
          onView={onView}
          onUpdate={onUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--muted)', fontSize: 13 }}>
          No tasks yet
        </div>
      )}
    </Card>
  );
}
