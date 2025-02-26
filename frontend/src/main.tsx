import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const originalError = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  originalError(...args);
};
