import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { uid, nowFull } from '../utils/dateUtils.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState({
    users: [], tasks: [], leaves: [], attendance: [], notifs: [],
    loading: false,
  });
  const [companyId, setCompanyId] = useState(null);

  // ── Load company data when companyId changes ──────────────────
  useEffect(() => {
    if (!companyId) return;

    const COLS = ['users', 'tasks', 'leaves', 'attendance', 'notifs'];
    let loaded = 0;

    const unsubs = COLS.map((col) =>
      onSnapshot(collection(db, 'companies', companyId, col), (snap) => {
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
  }, [companyId]);

  // ── Called from AuthContext after login ───────────────────────
  const initCompany = useCallback((cId) => {
    setCompanyId(cId);
    setState((p) => ({ ...p, loading: true }));
  }, []);

  // ── Dispatch → writes to company subcollection ────────────────
  const dispatch = useCallback(async (action) => {
    if (!companyId) return;
    const { type, payload } = action;
    const base = (col) => doc(db, 'companies', companyId, col, payload?.id || payload);

    try {
      switch (type) {
        case 'ADD_TASK':
        case 'UPDATE_TASK':
          await setDoc(doc(db, 'companies', companyId, 'tasks', payload.id), payload);
          break;
        case 'DELETE_TASK':
          await deleteDoc(doc(db, 'companies', companyId, 'tasks', payload));
          break;
        case 'ADD_LEAVE':
        case 'UPDATE_LEAVE':
          await setDoc(doc(db, 'companies', companyId, 'leaves', payload.id), payload);
          break;
        case 'ADD_ATTENDANCE':
        case 'UPDATE_ATTENDANCE':
          await setDoc(doc(db, 'companies', companyId, 'attendance', payload.id), payload);
          break;
        case 'ADD_NOTIF':
          await setDoc(doc(db, 'companies', companyId, 'notifs', payload.id), payload);
          break;
        case 'READ_NOTIF':
          await setDoc(doc(db, 'companies', companyId, 'notifs', payload), { read: true }, { merge: true });
          break;
        case 'READ_ALL_NOTIFS': {
          const mine = state.notifs.filter((n) => n.forId === payload && !n.read);
          await Promise.all(mine.map((n) =>
            setDoc(doc(db, 'companies', companyId, 'notifs', n.id), { read: true }, { merge: true })
          ));
          break;
        }
        case 'ADD_USER':
          await setDoc(doc(db, 'companies', companyId, 'users', payload.id), payload);
          break;
      }
    } catch (e) {
      console.error('Dispatch error:', type, e);
    }
  }, [companyId, state.notifs]);

  const addNotif = useCallback(async (text, forId) => {
    if (!companyId) return;
    const notif = { id: uid(), text, forId, read: false, at: nowFull() };
    await setDoc(doc(db, 'companies', companyId, 'notifs', notif.id), notif);
  }, [companyId]);

  return (
    <AppContext.Provider value={{ state, dispatch, addNotif, initCompany, companyId }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};