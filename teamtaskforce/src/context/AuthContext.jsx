import { createContext, useContext, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  /**
   * Login — checks Firestore users collection for matching credentials
   * Returns true on success, false on failure
   */
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const q = query(
        collection(db, 'users'),
        where('email',    '==', email),
        where('password', '==', password)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setCurrentUser({ id: snap.docs[0].id, ...snap.docs[0].data() });
        setAuthLoading(false);
        return true;
      }
      setAuthLoading(false);
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setAuthLoading(false);
      return false;
    }
  };

  const logout = () => setCurrentUser(null);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
