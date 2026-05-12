/**
 * useLeaves, useAttendance, useNotifications, useTeam
 * All write operations go directly to Firestore for real-time sync.
 */

import { updateDoc } from 'firebase/firestore';
import { useAppContext } from '../context/AppContext.jsx';
import { useAuth }       from '../context/AuthContext.jsx';
import { buildLeave, applyLeaveResponse } from '../services/leaveService.js';
import { buildCheckIn, applyCheckOut }    from '../services/attendanceService.js';
import {
  leaveDoc, attendDoc, notifDoc, userDoc,
  leavesCol, notifsCol, usersCol,
  fsSet, fsUpdate, fsDelete,
} from '../firebase/db.js';
import { todayStr } from '../utils/dateUtils.js';
import { ROLES }    from '../utils/constants.js';
import { getDocs, query, where } from 'firebase/firestore';

/* ─── useLeaves ─────────────────────────────────────────────────────────────── */
export function useLeaves() {
  const { state, addNotif } = useAppContext();
  const { currentUser, isAdmin } = useAuth();
  const { leaves, users } = state;

  const myLeaves = isAdmin ? leaves : leaves.filter((l) => l.userId === currentUser?.id);

  const applyLeave = async ({ fromDate, toDate, reason }) => {
    if (!fromDate || !toDate || !reason?.trim()) return 'All fields are required';
    if (fromDate > toDate) return 'Invalid date range';

    const leave = buildLeave({ userId: currentUser.id, fromDate, toDate, reason });
    await fsSet(leaveDoc(leave.id), leave);

    const admin = users.find((u) => u.role === ROLES.ADMIN);
    if (admin) await addNotif(`Leave request from ${currentUser.name} (${leave.days} day${leave.days > 1 ? 's' : ''})`, admin.id);
    return null;
  };

  const respondToLeave = async (leave, status) => {
    const updated = applyLeaveResponse(leave, status, currentUser.id);
    await fsSet(leaveDoc(leave.id), updated);
    await addNotif(`Your leave was ${status.toLowerCase()} by ${currentUser.name}`, leave.userId);
  };

  return { leaves, myLeaves, applyLeave, respondToLeave };
}

/* ─── useAttendance ─────────────────────────────────────────────────────────── */
export function useAttendance() {
  const { state } = useAppContext();
  const { currentUser, isAdmin } = useAuth();
  const { attendance } = state;

  const myAttendance = isAdmin ? attendance : attendance.filter((a) => a.userId === currentUser?.id);

  const todayRecord = attendance.find(
    (a) => a.userId === currentUser?.id && a.date === todayStr()
  );
  const checkedIn  = !!todayRecord?.checkIn;
  const checkedOut = !!todayRecord?.checkOut;

  const checkIn = async () => {
    if (checkedIn) return;
    const record = buildCheckIn(currentUser.id);
    await fsSet(attendDoc(record.id), record);
  };

  const checkOut = async () => {
    if (!checkedIn || checkedOut) return;
    const updated = applyCheckOut(todayRecord);
    await fsSet(attendDoc(todayRecord.id), updated);
  };

  return { attendance, myAttendance, todayRecord, checkedIn, checkedOut, checkIn, checkOut };
}

/* ─── useNotifications ──────────────────────────────────────────────────────── */
export function useNotifications() {
  const { state } = useAppContext();
  const { currentUser } = useAuth();
  const { notifs } = state;

  const myNotifs    = notifs.filter((n) => n.forId === currentUser?.id);
  const unreadCount = myNotifs.filter((n) => !n.read).length;

  const markRead = async (notifId) => {
    await fsUpdate(notifDoc(notifId), { read: true });
  };

  const markAllRead = async () => {
    const unread = myNotifs.filter((n) => !n.read);
    await Promise.all(unread.map((n) => fsUpdate(notifDoc(n.id), { read: true })));
  };

  return { myNotifs, unreadCount, markRead, markAllRead };
}

/* ─── useTeam ───────────────────────────────────────────────────────────────── */
export function useTeam() {
  const { state } = useAppContext();
  const { users } = state;

  const employees = users.filter((u) => u.role === ROLES.EMPLOYEE);

  const addEmployee = async ({ name, email, password }) => {
    if (!name?.trim() || !email?.trim() || !password?.trim()) return 'All fields are required';
    if (users.find((u) => u.email === email)) return 'Email already registered';

    const emp = {
      id:       'u' + Date.now(),
      name:     name.trim(),
      email:    email.trim(),
      password,
      role:     ROLES.EMPLOYEE,
    };
    await fsSet(userDoc(emp.id), emp);
    return null;
  };

  return { users, employees, addEmployee };
}
