import { AVA_PALETTE } from './constants.js';

/**
 * Get avatar initials from a name string
 * e.g. "Bhargav Bhatt" → "BB"
 */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/**
 * Get a deterministic avatar color for a given name
 */
export const getAvatarColor = (name = '') =>
  AVA_PALETTE[name.charCodeAt(0) % AVA_PALETTE.length];

/**
 * Status → { color, bg } CSS variable names
 * Returns inline-style-compatible object using CSS variables
 */
export const statusColors = (status) => {
  const map = {
    Pending:     { '--badge-color': 'var(--danger)',  '--badge-bg': 'var(--danger-bg)'  },
    'In Progress':{ '--badge-color': 'var(--warning)', '--badge-bg': 'var(--warning-bg)' },
    Done:        { '--badge-color': 'var(--success)', '--badge-bg': 'var(--success-bg)' },
  };
  return map[status] || { '--badge-color': 'var(--muted)', '--badge-bg': 'var(--accent-bg)' };
};

/**
 * Priority → badge CSS variables
 */
export const priorityColors = (priority) => {
  const map = {
    High:   { '--badge-color': 'var(--danger)',  '--badge-bg': 'var(--danger-bg)'  },
    Medium: { '--badge-color': 'var(--warning)', '--badge-bg': 'var(--warning-bg)' },
    Low:    { '--badge-color': 'var(--success)', '--badge-bg': 'var(--success-bg)' },
  };
  return map[priority] || { '--badge-color': 'var(--muted)', '--badge-bg': 'var(--accent-bg)' };
};

/**
 * Leave status → badge CSS variables
 */
export const leaveStatusColors = (status) => {
  const map = {
    Pending:  { '--badge-color': 'var(--warning)', '--badge-bg': 'var(--warning-bg)' },
    Approved: { '--badge-color': 'var(--success)', '--badge-bg': 'var(--success-bg)' },
    Rejected: { '--badge-color': 'var(--danger)',  '--badge-bg': 'var(--danger-bg)'  },
  };
  return map[status] || { '--badge-color': 'var(--muted)', '--badge-bg': 'var(--accent-bg)' };
};

/**
 * Completion rate color (CSS variable string)
 */
export const rateColor = (rate) => {
  if (rate >= 70) return 'var(--success)';
  if (rate >= 40) return 'var(--warning)';
  return 'var(--danger)';
};

/**
 * Truncate a string to maxLen characters
 */
export const truncate = (str = '', maxLen = 40) =>
  str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
