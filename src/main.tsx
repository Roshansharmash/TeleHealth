
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force light mode on load
if (typeof window !== "undefined" && typeof document !== "undefined") {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('theme', 'light');
}

createRoot(document.getElementById('root')!).render(<App />);
