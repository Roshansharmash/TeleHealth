
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force dark mode on load
if (typeof window !== "undefined" && typeof document !== "undefined") {
  document.documentElement.classList.add('dark');
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
}

createRoot(document.getElementById('root')!).render(<App />);
