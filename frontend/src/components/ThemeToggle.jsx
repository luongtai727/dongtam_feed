import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dt_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dt_theme', theme);
  }, [theme]);

  const toggle = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme" title={theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}>
      <div className="theme-toggle-track">
        <div className={`theme-toggle-thumb ${theme}`}>
          {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
        </div>
        <Sun size={11} className="track-icon track-sun" />
        <Moon size={11} className="track-icon track-moon" />
      </div>
    </button>
  );
}
