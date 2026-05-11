import { Card } from '../ui/Badge.jsx';
import { Avatar } from '../ui/Badge.jsx';
import { StatCard } from '../ui/Badge.jsx';
import { Badge } from '../ui/Badge.jsx';
import { priorityColors, rateColor } from '../../utils/helpers.js';
import { isOverdue, todayStr } from '../../utils/dateUtils.js';

/** ─── PerfBar ─── */
function PerfBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="perf-bar">
      <div className="perf-bar-header">
        <span className="perf-bar-label">{label}</span>
        <span className="perf-bar-value" style={{ color }}>
          {count} ({pct}%)
        </span>
      </div>
      <div className="perf-bar-track">
        <div className="perf-bar-fill" style={{ '--bar-width': `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/** ─── ReportsView (admin only) ─── */
export default function ReportsView({ tasks, attendance, employees, users }) {
  const today        = todayStr();
  const completedToday = tasks.filter((t) => t.status === 'Done' && t.updatedAt === today);
  const inProgressT  = tasks.filter((t) => t.status === 'In Progress');
  const pendingT     = tasks.filter((t) => t.status === 'Pending');
  const overdueT     = tasks.filter((t) => isOverdue(t.deadline, t.status));
  const attToday     = attendance.filter((a) => a.date === today);

  return (
    <div>
      <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 14 }}>
        Auto-generated report for {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
      </div>

      {/* Summary */}
      <div className="stats-grid">
        <StatCard label="Completed Today" value={completedToday.length} icon="✅" accentColor="var(--success)" />
        <StatCard label="In Progress"     value={inProgressT.length}   icon="⏳" accentColor="var(--warning)" />
        <StatCard label="Pending"         value={pendingT.length}      icon="🔴" accentColor="var(--danger)"  />
        <StatCard label="Overdue"         value={overdueT.length}      icon="⚠️" accentColor="var(--danger)" sub="need attention" />
        <StatCard label="Present Today"   value={attToday.length}      icon="📍" accentColor="var(--primary)" sub={`of ${employees.length} employees`} />
      </div>

      {/* Employee breakdown */}
      <Card className="mb-16">
        <h3 className="section-title mb-16">Employee Performance Report</h3>
        {employees.map((e) => {
          const et     = tasks.filter((t) => t.assignedTo === e.id);
          const done   = et.filter((t) => t.status === 'Done').length;
          const inprog = et.filter((t) => t.status === 'In Progress').length;
          const pend   = et.filter((t) => t.status === 'Pending').length;
          const od     = et.filter((t) => isOverdue(t.deadline, t.status)).length;
          const rate   = et.length ? Math.round((done / et.length) * 100) : 0;
          const att    = attendance.find((a) => a.userId === e.id && a.date === today);

          return (
            <div key={e.id} className="report-emp-row">
              <div className="report-emp-header">
                <Avatar name={e.name} size={36} />
                <div className="report-emp-info">
                  <div className="report-emp-name">{e.name}</div>
                  <div className="report-emp-att" style={{ color: att ? 'var(--success)' : 'var(--danger)' }}>
                    {att
                      ? `Present · In: ${att.checkIn}${att.checkOut ? ` · Out: ${att.checkOut} (${att.duration})` : ' · Still working'}`
                      : 'Absent / Not checked in'
                    }
                  </div>
                </div>
                <div className="report-emp-rate">
                  <div className="report-emp-rate-value" style={{ color: rateColor(rate) }}>{rate}%</div>
                  <div className="report-emp-rate-label">completion</div>
                </div>
              </div>
              <PerfBar label="Done"        count={done}   total={et.length} color="var(--success)" />
              <PerfBar label="In Progress" count={inprog} total={et.length} color="var(--warning)" />
              <PerfBar label="Pending"     count={pend}   total={et.length} color="var(--danger)"  />
              {od > 0 && <div className="report-overdue-note">⚠ {od} overdue task{od > 1 ? 's' : ''}</div>}
            </div>
          );
        })}
      </Card>

      {/* Completed today */}
      {completedToday.length > 0 && (
        <Card className="mb-16">
          <h3 className="section-title mb-12">✅ Completed Today ({completedToday.length})</h3>
          {completedToday.map((t) => {
            const emp = users.find((u) => u.id === t.assignedTo);
            return (
              <div key={t.id} className="report-task-row">
                <span style={{ color: 'var(--success)', fontSize: 16 }}>✓</span>
                <div>
                  <div className="report-task-name">{t.title}</div>
                  <div className="report-task-by">by {emp?.name}</div>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Overdue */}
      {overdueT.length > 0 && (
        <Card style={{ border: '1.5px solid color-mix(in srgb, var(--danger) 33%, transparent)' }}>
          <h3 className="section-title mb-12" style={{ color: 'var(--danger)' }}>
            ⚠ Overdue Tasks ({overdueT.length})
          </h3>
          {overdueT.map((t) => {
            const emp = users.find((u) => u.id === t.assignedTo);
            return (
              <div key={t.id} className="report-task-row">
                <Badge label={t.priority} style={priorityColors(t.priority)} />
                <div>
                  <div className="report-task-name">{t.title}</div>
                  <div className="report-task-by">{emp?.name} · Due: {t.deadline}</div>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
