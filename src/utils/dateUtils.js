/**
 * Date & time utility functions
 */

/** Generate a unique short ID */
export const uid = () => 'x' + Math.random().toString(36).slice(2, 10);

/** Today's date as YYYY-MM-DD string */
export const todayStr = () => new Date().toISOString().split('T')[0];

/** Current time as HH:MM string */
export const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/** Current date+time as readable string e.g. "12 May 14:30" */
export const nowFull = () => {
  const d = new Date();
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' ' + nowTime();
};

/** Calculate inclusive number of days between two date strings */
export const calcDays = (from, to) =>
  Math.max(1, Math.round((new Date(to) - new Date(from)) / 86_400_000) + 1);

/** Check if a task is overdue */
export const isOverdue = (deadline, status) =>
  deadline && deadline < todayStr() && status !== 'Done';

/** Days until a deadline (negative = past) */
export const daysUntil = (deadline) => {
  if (!deadline) return null;
  return Math.round((new Date(deadline) - new Date(todayStr())) / 86_400_000);
};

/** Format a YYYY-MM-DD string to "12 May 2025" */
export const fmtDate = (d) =>
  d
    ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

/** Add or subtract N days from today, returns YYYY-MM-DD */
export const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

/** Readable today string e.g. "Monday, 12 May 2025" */
export const todayReadable = () =>
  new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

/** Calculate duration string from two HH:MM strings */
export const calcDuration = (checkIn, checkOut) => {
  const [ch, cm] = checkIn.split(':').map(Number);
  const [oh, om] = checkOut.split(':').map(Number);
  const mins = oh * 60 + om - (ch * 60 + cm);
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};
