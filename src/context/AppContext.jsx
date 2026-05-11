import { createContext, useContext, useReducer, useEffect } from 'react';
import { SEED_USERS, SEED_TASKS, SEED_LEAVES, SEED_ATTENDANCE, SEED_NOTIFS } from '../data/seedData.js';
import { loadData, saveData } from '../services/storageService.js';
import { uid, nowFull } from '../utils/dateUtils.js';

/* ─── Initial State ─────────────────────────────────────────── */
const initialState = {
  users:      SEED_USERS,
  tasks:      SEED_TASKS,
  leaves:     SEED_LEAVES,
  attendance: SEED_ATTENDANCE,
  notifs:     SEED_NOTIFS,
};

/* ─── Reducer ───────────────────────────────────────────────── */
function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };

    // Tasks
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map((t) => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };

    // Leaves
    case 'ADD_LEAVE':
      return { ...state, leaves: [action.payload, ...state.leaves] };
    case 'UPDATE_LEAVE':
      return { ...state, leaves: state.leaves.map((l) => l.id === action.payload.id ? action.payload : l) };

    // Attendance
    case 'ADD_ATTENDANCE':
      return { ...state, attendance: [action.payload, ...state.attendance] };
    case 'UPDATE_ATTENDANCE':
      return { ...state, attendance: state.attendance.map((a) => a.id === action.payload.id ? action.payload : a) };

    // Notifications
    case 'ADD_NOTIF':
      return { ...state, notifs: [action.payload, ...state.notifs] };
    case 'READ_NOTIF':
      return { ...state, notifs: state.notifs.map((n) => n.id === action.payload ? { ...n, read: true } : n) };
    case 'READ_ALL_NOTIFS':
      return { ...state, notifs: state.notifs.map((n) => n.forId === action.payload ? { ...n, read: true } : n) };

    // Users
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };

    default:
      return state;
  }
}

/* ─── Context ───────────────────────────────────────────────── */
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    const saved = loadData();
    if (saved) dispatch({ type: 'LOAD_DATA', payload: saved });
  }, []);

  // Persist on every state change
  useEffect(() => {
    saveData(state);
  }, [state]);

  // ─── Notification helper ────────────────────────────────────
  const addNotif = (text, forId) => {
    dispatch({
      type: 'ADD_NOTIF',
      payload: { id: uid(), text, forId, read: false, at: nowFull() },
    });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addNotif }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};
