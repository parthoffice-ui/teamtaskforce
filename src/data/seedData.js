import { addDays, todayStr, nowFull } from '../utils/dateUtils.js';

/**
 * Initial seed data for the application.
 * In production, this would be replaced by API/database calls.
 */

export const SEED_USERS = [
  { id: 'u1', name: 'Bhargav Bhatt', email: 'bhargav@office.com', password: 'boss123',   role: 'admin'    },
  { id: 'u2', name: 'Parth',         email: 'parth@office.com',   password: 'parth123',  role: 'employee' },
  { id: 'u3', name: 'Urvil',         email: 'urvil@office.com',   password: 'urvil123',  role: 'employee' },
  { id: 'u4', name: 'Yadav Ji',      email: 'yadav@office.com',   password: 'yadav123',  role: 'employee' },
];

export const SEED_TASKS = [
  {
    id: 't1',
    title: 'Design New Landing Page',
    description: 'Create wireframes and mockups for the company website with mobile-responsive design.',
    assignedTo: 'u2', assignedBy: 'u1',
    status: 'In Progress', priority: 'High',
    deadline: addDays(3), createdAt: todayStr(), updatedAt: todayStr(),
    comments: [
      { id: 'c1', text: 'Working on wireframes, should be done by EOD.', reason: '', byId: 'u2', byName: 'Parth', at: nowFull() },
    ],
    history: [
      { action: 'Task created', by: 'Bhargav Bhatt', at: todayStr() },
      { action: 'Status → In Progress', by: 'Parth', at: todayStr() },
    ],
  },
  {
    id: 't2',
    title: 'Write Q4 Financial Report',
    description: 'Compile Q4 data, KPIs and projections. Submit to management before deadline.',
    assignedTo: 'u3', assignedBy: 'u1',
    status: 'Pending', priority: 'Medium',
    deadline: addDays(7), createdAt: todayStr(), updatedAt: todayStr(),
    comments: [],
    history: [{ action: 'Task created', by: 'Bhargav Bhatt', at: todayStr() }],
  },
  {
    id: 't3',
    title: 'Fix Authentication Bug',
    description: 'Investigate and resolve JWT token expiry issue reported by QA team.',
    assignedTo: 'u4', assignedBy: 'u1',
    status: 'Done', priority: 'High',
    deadline: addDays(-1), createdAt: addDays(-3), updatedAt: todayStr(),
    comments: [
      { id: 'c2', text: 'Fixed JWT token expiry and updated refresh logic.', reason: 'Root cause: token TTL mismatch on staging server', byId: 'u4', byName: 'Yadav Ji', at: nowFull() },
    ],
    history: [
      { action: 'Task created', by: 'Bhargav Bhatt', at: addDays(-3) },
      { action: 'Status → In Progress', by: 'Yadav Ji', at: addDays(-2) },
      { action: 'Status → Done', by: 'Yadav Ji', at: todayStr() },
    ],
  },
  {
    id: 't4',
    title: 'Prepare Client Presentation',
    description: "Build slides for Friday's client demo. Highlight Q3 results and roadmap.",
    assignedTo: 'u2', assignedBy: 'u3',
    status: 'Pending', priority: 'High',
    deadline: addDays(2), createdAt: todayStr(), updatedAt: todayStr(),
    comments: [],
    history: [{ action: 'Task assigned by Urvil', by: 'Urvil', at: todayStr() }],
  },
  {
    id: 't5',
    title: 'Update Product Documentation',
    description: 'Review and update all product docs to reflect v2.0 feature changes.',
    assignedTo: 'u3', assignedBy: 'u2',
    status: 'Pending', priority: 'Low',
    deadline: addDays(5), createdAt: todayStr(), updatedAt: todayStr(),
    comments: [],
    history: [{ action: 'Task assigned by Parth', by: 'Parth', at: todayStr() }],
  },
];

export const SEED_LEAVES = [
  {
    id: 'l1', userId: 'u2',
    fromDate: addDays(5), toDate: addDays(6), days: 2,
    reason: 'Family function in Ahmedabad',
    status: 'Pending', appliedAt: todayStr(), respondedBy: null, respondedAt: null,
  },
  {
    id: 'l2', userId: 'u3',
    fromDate: addDays(-10), toDate: addDays(-9), days: 2,
    reason: 'Medical appointment',
    status: 'Approved', appliedAt: addDays(-12), respondedBy: 'u1', respondedAt: addDays(-11),
  },
  {
    id: 'l3', userId: 'u4',
    fromDate: addDays(-5), toDate: addDays(-5), days: 1,
    reason: 'Personal work',
    status: 'Rejected', appliedAt: addDays(-7), respondedBy: 'u1', respondedAt: addDays(-6),
  },
];

export const SEED_ATTENDANCE = [
  { id: 'a1', userId: 'u2', date: addDays(-1), checkIn: '09:15', checkOut: '18:30', duration: '9h 15m' },
  { id: 'a2', userId: 'u3', date: addDays(-1), checkIn: '09:00', checkOut: '17:45', duration: '8h 45m' },
  { id: 'a3', userId: 'u4', date: addDays(-1), checkIn: '09:30', checkOut: '18:00', duration: '8h 30m' },
  { id: 'a4', userId: 'u2', date: addDays(-2), checkIn: '09:00', checkOut: '18:00', duration: '9h 0m'  },
  { id: 'a5', userId: 'u3', date: addDays(-2), checkIn: '09:10', checkOut: '17:50', duration: '8h 40m' },
  { id: 'a6', userId: 'u4', date: addDays(-2), checkIn: '09:45', checkOut: '17:30', duration: '7h 45m' },
];

export const SEED_NOTIFS = [
  { id: 'n1', text: 'New task: Design New Landing Page',               forId: 'u2', read: false, at: todayStr() },
  { id: 'n2', text: 'New task: Write Q4 Financial Report',             forId: 'u3', read: false, at: todayStr() },
  { id: 'n3', text: "Yadav Ji marked 'Fix Authentication Bug' as Done", forId: 'u1', read: false, at: todayStr() },
  { id: 'n4', text: 'New task from Urvil: Prepare Client Presentation', forId: 'u2', read: false, at: todayStr() },
  { id: 'n5', text: 'Leave request from Parth — 2 days',               forId: 'u1', read: false, at: todayStr() },
];
