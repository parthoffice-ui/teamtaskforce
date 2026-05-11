import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * Log in: find user by email+password in the users array
   * Returns true on success, false on failure
   */
  const login = (users, email, password) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
