/**
 * Storage Service
 *
 * Abstracts data persistence. Currently uses localStorage.
 * To migrate to Firebase or Supabase, only this file needs to change.
 */

import { STORAGE_KEY } from '../utils/constants.js';

/**
 * Load all app data from storage.
 * Returns null if no data found.
 */
export const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('[StorageService] Failed to load data:', err);
    return null;
  }
};

/**
 * Save all app data to storage.
 */
export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[StorageService] Failed to save data:', err);
  }
};

/**
 * Clear all app data from storage.
 */
export const clearData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('[StorageService] Failed to clear data:', err);
  }
};

// ─── Future Firebase/Supabase migration hooks ───────────────────────────────
//
// export const loadData = async () => {
//   const snapshot = await getDoc(doc(db, 'appData', userId));
//   return snapshot.exists() ? snapshot.data() : null;
// };
//
// export const saveData = async (data) => {
//   await setDoc(doc(db, 'appData', userId), data, { merge: true });
// };
