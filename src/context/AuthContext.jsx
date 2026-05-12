import { createContext, useContext, useState } from 'react';
import { 
  signInWithPopup, signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  collection, query, where, getDocs,
  doc, setDoc, getDoc 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser,    setCurrentUser]    = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [authLoading,    setAuthLoading]    = useState(false);

  // ── Email/Password Login ──────────────────────────────────────
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await loadUserData(cred.user.uid);
      setAuthLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setAuthLoading(false);
      return false;
    }
  };

  // ── Google Login ──────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setAuthLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await loadUserData(cred.user.uid);
      setAuthLoading(false);
      return true;
    } catch (err) {
      console.error('Google login error:', err);
      setAuthLoading(false);
      return false;
    }
  };

  // ── Load user + company data from Firestore ───────────────────
  const loadUserData = async (uid) => {
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (!userSnap.exists()) return false;
    
    const userData = { id: uid, ...userSnap.data() };
    setCurrentUser(userData);

    if (userData.companyId) {
      const compSnap = await getDoc(doc(db, 'companies', userData.companyId));
      if (compSnap.exists()) {
        setCurrentCompany({ id: compSnap.id, ...compSnap.data() });
      }
    }
    return true;
  };

  // ── Register Company + Admin ──────────────────────────────────
  const registerCompany = async ({ companyName, adminName, email, password }) => {
    setAuthLoading(true);
    try {
      // Create Firebase Auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid  = cred.user.uid;
      const companyId = 'comp_' + uid.slice(0, 8);

      // Create company doc
      await setDoc(doc(db, 'companies', companyId), {
        id: companyId,
        name: companyName,
        plan: 'free',
        maxUsers: 10,
        createdAt: new Date().toISOString().split('T')[0],
        adminId: uid,
      });

      // Create admin user doc
      await setDoc(doc(db, 'users', uid), {
        id: uid,
        name: adminName,
        email,
        role: 'admin',
        companyId,
        createdAt: new Date().toISOString().split('T')[0],
      });

      await loadUserData(uid);
      setAuthLoading(false);
      return { success: true };
    } catch (err) {
      setAuthLoading(false);
      if (err.code === 'auth/email-already-in-use') 
        return { success: false, error: 'Email already registered!' };
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setCurrentCompany(null);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      currentUser, currentCompany,
      login, loginWithGoogle, logout,
      registerCompany, authLoading, isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};