/**
 * Firestore collection references + seed data initializer.
 * All Firestore reads/writes go through these helpers.
 */

import {
  collection, doc,
  addDoc, setDoc, updateDoc, deleteDoc,
  getDocs, writeBatch,
} from 'firebase/firestore';
import { db } from './config.js';
import { SEED_USERS, SEED_TASKS, SEED_LEAVES, SEED_ATTENDANCE, SEED_NOTIFS } from '../data/seedData.js';

// ─── Collection References ────────────────────────────────────────────────────
export const usersCol      = collection(db, 'users');
export const tasksCol      = collection(db, 'tasks');
export const leavesCol     = collection(db, 'leaves');
export const attendanceCol = collection(db, 'attendance');
export const notifsCol     = collection(db, 'notifs');

// ─── Doc References ───────────────────────────────────────────────────────────
export const userDoc      = (id) => doc(db, 'users',      id);
export const taskDoc      = (id) => doc(db, 'tasks',      id);
export const leaveDoc     = (id) => doc(db, 'leaves',     id);
export const attendDoc    = (id) => doc(db, 'attendance', id);
export const notifDoc     = (id) => doc(db, 'notifs',     id);

// ─── CRUD Helpers ─────────────────────────────────────────────────────────────
export const fsAdd    = (col, data)     => addDoc(col, data);
export const fsSet    = (ref, data)     => setDoc(ref, data);
export const fsUpdate = (ref, data)     => updateDoc(ref, data);
export const fsDelete = (ref)           => deleteDoc(ref);

// ─── Seed Data Initializer ────────────────────────────────────────────────────
/**
 * Called once on app start.
 * If Firestore 'users' collection is empty → upload all seed data.
 * This ensures every fresh Firebase project gets demo data automatically.
 */
export const initSeedData = async () => {
  try {
    const snap = await getDocs(usersCol);
    if (!snap.empty) return; // Already initialized — skip

    console.log('[Firebase] First run — uploading seed data...');
    const batch = writeBatch(db);

    SEED_USERS.forEach((u)      => batch.set(doc(db, 'users',      u.id), u));
    SEED_TASKS.forEach((t)      => batch.set(doc(db, 'tasks',      t.id), t));
    SEED_LEAVES.forEach((l)     => batch.set(doc(db, 'leaves',     l.id), l));
    SEED_ATTENDANCE.forEach((a) => batch.set(doc(db, 'attendance', a.id), a));
    SEED_NOTIFS.forEach((n)     => batch.set(doc(db, 'notifs',     n.id), n));

    await batch.commit();
    console.log('[Firebase] Seed data uploaded ✓');
  } catch (err) {
    console.error('[Firebase] Seed init failed:', err);
  }
};
