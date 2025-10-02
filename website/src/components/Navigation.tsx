import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const navItems = [
    { path: '/', label: 'Головна', icon: '🏠' },
    { path: '/search', label: 'Пошук', icon: '🔍' },
    { path: '/player', label: 'Гравець', icon: '🎲' },
    { path: '/gm', label: 'Майстер', icon: '🎭' },
    { path: '/glossary', label: 'Глосарій', icon: '📚' },
  ];

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('grimwild-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('grimwild-theme', newTheme);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <h1>Grimwild</h1>
          <span className="nav-subtitle">Українська адаптація</span>
        </Link>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Перемкнути на світлу тему' : 'Перемкнути на темну тему'}
            >
              <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
