import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider }  from './context/AuthContext.jsx';
import { AppProvider }   from './context/AppContext.jsx';
import AppRouter         from './router/AppRouter.jsx';

/**
 * Root application component.
 * Wraps everything in providers (order matters — outer to inner).
 */
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
