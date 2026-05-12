import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  // Sync dark mode with <html data-theme="...">
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleDark = () => setDark((p) => !p);

  return (
    <ThemeContext.Provider value={{ dark, setDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook to consume theme context */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
