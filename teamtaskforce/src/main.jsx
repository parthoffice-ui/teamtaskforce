import { StrictMode } from 'react';
import { createRoot }  from 'react-dom/client';
import App             from './App.jsx';

// Global styles (import order matters)
import './styles/variables.css';
import './styles/animations.css';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
