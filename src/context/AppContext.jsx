import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { SEED_USERS, SEED_TASKS, SEED_LEAVES, SEED_ATTENDANCE, SEED_NOTIFS } from '../data/seedData.js';
import { uid, nowFull } from '../utils/dateUtils.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState({
    users: [], tasks: [], leaves: [], attendance: [], notifs: [],
    loading: true,
  });

  useEffect(() => {
    const seedIfEmpty = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        if (!snap.empty) return;
        await Promise.all([
          ...SEED_USERS.map((d)      => setDoc(doc(db, 'users',      d.id), d)),
          ...SEED_TASKS.map((d)      => setDoc(doc(db, 'tasks',      d.id), d)),
          ...SEED_LEAVES.map((d)     => setDoc(doc(db, 'leaves',     d.id), d)),
          ...SEED_ATTENDANCE.map((d) => setDoc(doc(db, 'attendance', d.id), d)),
          ...SEED_NOTIFS.map((d)     => setDoc(doc(db, 'notifs',     d.id), d)),
        ]);
      } catch (e) {
        console.error('Seed error:', e);
      }
    };
    seedIfEmpty();
  }, []);

  useEffect(() => {
    const COLS = ['users', 'tasks', 'leaves', 'attendance', 'notifs'];
    let loaded = 0;
    const unsubs = COLS.map((col) =>
      onSnapshot(collection(db, col), (snap) => {
        const data = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        loaded++;
        setState((prev) => ({
          ...prev,
          [col]: data,
          loading: loaded < COLS.length,
        }));
      })
    );
    return () => unsubs.forEach((u) => u());
  }, []);

  const dispatch = useCallback(async (action) => {
    const { type, payload } = action;
    try {
      switch (type) {
        case 'ADD_TASK':
        case 'UPDATE_TASK':
          await setDoc(doc(db, 'tasks', payload.id), payload);
          break;
        case 'DELETE_TASK':
          await deleteDoc(doc(db, 'tasks', payload));
          break;
        case 'ADD_LEAVE':
        case 'UPDATE_LEAVE':
          await setDoc(doc(db, 'leaves', payload.id), payload);
          break;
        case 'ADD_ATTENDANCE':
        case 'UPDATE_ATTENDANCE':
          await setDoc(doc(db, 'attendance', payload.id), payload);
          break;
        case 'ADD_NOTIF':
          await setDoc(doc(db, 'notifs', payload.id), payload);
          break;
        case 'READ_NOTIF':
          await setDoc(doc(db, 'notifs', payload), { read: true }, { merge: true });
          break;
        case 'READ_ALL_NOTIFS': {
          const mine = state.notifs.filter((n) => n.forId === payload && !n.read);
          await Promise.all(mine.map((n) => setDoc(doc(db, 'notifs', n.id), { read: true }, { merge: true })));
          break;
        }
        case 'ADD_USER':
          await setDoc(doc(db, 'users', payload.id), payload);
          break;
      }
    } catch (e) {
      console.error('Dispatch error:', type, e);
    }
  }, [state.notifs]);

  const addNotif = useCallback(async (text, forId) => {
    const notif = { id: uid(), text, forId, read: false, at: nowFull() };
    await setDoc(doc(db, 'notifs', notif.id), notif);
  }, []);

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