import { Card } from '../ui/Badge.jsx';
import { Avatar } from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { todayStr, todayReadable } from '../../utils/dateUtils.js';

/** ─── CheckInPanel (employee) ─── */
export function CheckInPanel({ todayRecord, checkedIn, checkedOut, onCheckIn, onCheckOut }) {
  return (
    <Card className="mb-18">
      <h3 className="section-title mb-14">Today — {todayReadable()}</h3>

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
      </div>

      <div className="flex gap-10">
        <Button
          variant={checkedIn ? 'ghost' : 'success'}
          className="w-full"
          style={{ padding: 11, fontSize: 14, opacity: checkedIn ? 0.5 : 1 }}
          onClick={onCheckIn}
          disabled={checkedIn}
        >
          {checkedIn ? '✓ Checked In' : '📍 Check In'}
        </Button>
        <Button
          variant={checkedOut ? 'ghost' : checkedIn ? 'warn' : 'ghost'}
          className="w-full"
          style={{ padding: 11, fontSize: 14, opacity: (!checkedIn || checkedOut) ? 0.5 : 1 }}
          onClick={onCheckOut}
          disabled={!checkedIn || checkedOut}
        >
          {checkedOut ? '✓ Checked Out' : '🚪 Check Out'}
        </Button>
      </div>

      {todayRecord?.duration && (
        <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--success)', fontSize: 14, fontWeight: 700 }}>
          Total hours today: {todayRecord.duration}
        </div>
      )}
    </Card>
  );
}

/** ─── AdminAttendanceOverview ─── */
export function AdminAttendanceOverview({ employees, attendance }) {
  return (
    <Card className="mb-16">
      <h3 className="section-title mb-12">Today's Overview</h3>
      <div className="flex gap-10 flex-wrap">
        {employees.map((e) => {
          const rec = attendance.find((a) => a.userId === e.id && a.date === todayStr());
          return (
            <div key={e.id} className={`emp-att-card ${rec ? 'present' : 'absent'}`}>
              <div className="emp-att-card-header">
                <Avatar name={e.name} size={24} />
                <span className="emp-att-card-name">{e.name}</span>
              </div>
              {rec ? (
                <>
                  <div className="emp-att-card-status present">✓ Present</div>
                  <div className="emp-att-card-detail">In: {rec.checkIn}{rec.checkOut ? ` · Out: ${rec.checkOut}` : ''}</div>
                  {rec.duration && <div className="emp-att-card-detail">{rec.duration}</div>}
                </>
              ) : (
                <div className="emp-att-card-status absent">✗ Not checked in</div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/** ─── AttendanceHistory ─── */
export function AttendanceHistory({ records, users, isAdmin }) {
  if (records.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>📅</div>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>No attendance records yet</div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {records.map((a) => {
        const emp = users.find((u) => u.id === a.userId);
        const dateStr = new Date(a.date + 'T00:00:00').toLocaleDateString('en-IN', {
          weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
        });
        return (
          <Card key={a.id} style={{ padding: '12px 16px' }}>
            <div className="att-row">
              <div className="att-row-left">
                {isAdmin && <Avatar name={emp?.name || '?'} size={30} />}
                <div>
                  {isAdmin && <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>{emp?.name}</div>}
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{dateStr}</div>
                </div>
              </div>
              <div className="att-row-right">
                <div className="att-col">
                  <div className="att-col-label">In</div>
                  <div className="att-col-value" style={{ color: 'var(--success)' }}>{a.checkIn || '—'}</div>
                </div>
                <div className="att-col">
                  <div className="att-col-label">Out</div>
                  <div className="att-col-value" style={{ color: a.checkOut ? 'var(--warning)' : 'var(--muted)' }}>{a.checkOut || '—'}</div>
                </div>
                <div className="att-col">
                  <div className="att-col-label">Hours</div>
                  <div className="att-col-value" style={{ color: 'var(--text)' }}>{a.duration || '—'}</div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
