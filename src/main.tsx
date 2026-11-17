import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress third-party browser extension (e.g., MetaMask inpage.js) connection errors inside sandboxed preview iframes
if (typeof window !== 'undefined') {
  const prevOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    const combined = `${String(message ?? '')} ${String(source ?? '')} ${String(error?.stack ?? '')}`;
    if (
      combined.includes('MetaMask') ||
      combined.includes('chrome-extension://') ||
      combined.includes('inpage.js')
    ) {
      return true;
    }
    return prevOnError ? prevOnError(message, source, lineno, colno, error) : false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
