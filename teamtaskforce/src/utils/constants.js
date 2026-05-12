/** Application-wide constants */

export const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' };

export const STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export const PRIORITY = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const STORAGE_KEY = 'ttf_v3';

/** Avatar background color palette */
export const AVA_PALETTE = [
  '#28396C', '#6b46b0', '#1d7a50', '#a06010',
  '#b03030', '#1565c0', '#7B3F00', '#2D7DD2',
  '#5C4033', '#2E7D6E',
];

/** Admin nav items */
export const ADMIN_NAV = [
  { id: 'dashboard',  icon: '◈',  label: 'Dashboard'  },
  { id: 'tasks',      icon: '☰',  label: 'All Tasks'  },
  { id: 'leave',      icon: '🏖',  label: 'Leave'      },
  { id: 'attendance', icon: '📍', label: 'Attendance' },
  { id: 'reports',    icon: '📊', label: 'Reports'    },
  { id: 'team',       icon: '👥', label: 'Team'       },
];

/** Employee nav items */
export const EMPLOYEE_NAV = [
  { id: 'dashboard',  icon: '◈',  label: 'Dashboard'  },
  { id: 'tasks',      icon: '☰',  label: 'My Tasks'   },
  { id: 'createtask', icon: '＋', label: 'New Task'   },
  { id: 'leave',      icon: '🏖',  label: 'Leave'      },
  { id: 'attendance', icon: '📍', label: 'Attendance' },
];

/** Page title map */
export const PAGE_TITLES = {
  dashboard:  { admin: 'Admin Dashboard', employee: 'My Dashboard' },
  tasks:      { admin: 'All Tasks',       employee: 'My Tasks'     },
  createtask: { admin: 'New Task',        employee: 'New Task'     },
  leave:      { admin: 'Leave Management', employee: 'Leave'       },
  attendance: { admin: 'Attendance',      employee: 'Attendance'   },
  reports:    { admin: 'Daily Reports',   employee: 'Reports'      },
  team:       { admin: 'Team Management', employee: 'Team'         },
};
