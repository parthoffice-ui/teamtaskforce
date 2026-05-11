import { useAppContext } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { buildLeave, applyLeaveResponse } from '../services/leaveService.js';
import { buildCheckIn, applyCheckOut } from '../services/attendanceService.js';
import { todayStr } from '../utils/dateUtils.js';
import { ROLES } from '../utils/constants.js';

/* ─── useLeaves ─────────────────────────────────────────────── */
export function useLeaves() {
  const { state, dispatch, addNotif } = useAppContext();
  const { currentUser, isAdmin } = useAuth();
  const { leaves, users } = state;

  const myLeaves = isAdmin ? leaves : leaves.filter((l) => l.userId === currentUser?.id);

  /**
   * Apply for leave (employee)
   */
  const applyLeave = ({ fromDate, toDate, reason }) => {
    if (!fromDate || !toDate || !reason?.trim()) return 'All fields are required';
    if (fromDate > toDate) return 'Invalid date range';

    const leave = buildLeave({ userId: currentUser.id, fromDate, toDate, reason });
    dispatch({ type: 'ADD_LEAVE', payload: leave });

    const admin = users.find((u) => u.role === ROLES.ADMIN);
    if (admin) addNotif(`Leave request from ${currentUser.name} (${leave.days} day${leave.days > 1 ? 's' : ''})`, admin.id);

    return null;
  };

  /**
   * Approve or reject a leave (admin)
   */
  const respondToLeave = (leave, status) => {
    const updated = applyLeaveResponse(leave, status, currentUser.id);
    dispatch({ type: 'UPDATE_LEAVE', payload: updated });
    addNotif(`Your leave request was ${status.toLowerCase()} by ${currentUser.name}`, leave.userId);
  };

  return { leaves, myLeaves, applyLeave, respondToLeave };
}

/* ─── useAttendance ─────────────────────────────────────────── */
export function useAttendance() {
  const { state, dispatch } = useAppContext();
  const { currentUser, isAdmin } = useAuth();
  const { attendance, users } = state;

  const myAttendance = isAdmin ? attendance : attendance.filter((a) => a.userId === currentUser?.id);

  const todayRecord = attendance.find(
    (a) => a.userId === currentUser?.id && a.date === todayStr()
  );
  const checkedIn  = !!todayRecord?.checkIn;
  const checkedOut = !!todayRecord?.checkOut;

  const checkIn = () => {
    if (checkedIn) return;
    dispatch({ type: 'ADD_ATTENDANCE', payload: buildCheckIn(currentUser.id) });
  };

  const checkOut = () => {
    if (!checkedIn || checkedOut) return;
    dispatch({ type: 'UPDATE_ATTENDANCE', payload: applyCheckOut(todayRecord) });
  };

  return {
    attendance,
    myAttendance,
    todayRecord,
    checkedIn,
    checkedOut,
    checkIn,
    checkOut,
  };
}

/* ─── useNotifications ──────────────────────────────────────── */
export function useNotifications() {
  const { state, dispatch } = useAppContext();
  const { currentUser } = useAuth();
  const { notifs } = state;

  const myNotifs = notifs.filter((n) => n.forId === currentUser?.id);
  const unreadCount = myNotifs.filter((n) => !n.read).length;

  const markRead = (notifId) => dispatch({ type: 'READ_NOTIF', payload: notifId });
  const markAllRead = () => dispatch({ type: 'READ_ALL_NOTIFS', payload: currentUser?.id });

  return { myNotifs, unreadCount, markRead, markAllRead };
}

/* ─── useTeam ───────────────────────────────────────────────── */
export function useTeam() {
  const { state, dispatch } = useAppContext();
  const { users } = state;

  const employees = users.filter((u) => u.role === ROLES.EMPLOYEE);

  /**
   * Add a new employee (admin)
   */
  const addEmployee = ({ name, email, password }) => {
    if (!name?.trim() || !email?.trim() || !password?.trim()) return 'All fields are required';
    if (users.find((u) => u.email === email)) return 'Email already registered';

    const emp = {
      id: 'u' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      password,
      role: ROLES.EMPLOYEE,
    };
    dispatch({ type: 'ADD_USER', payload: emp });
    return null;
  };

  return { users, employees, addEmployee };
}
