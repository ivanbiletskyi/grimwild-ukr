import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when navigating
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={handleNavClick}>
          <h1>Grimwild</h1>
          <span className="nav-subtitle">Українська адаптація</span>
        </Link>
        
        <button 
          className={`burger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>

        <div className={`nav-menu-wrapper ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
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
      </div>
    </nav>
  );
};

export default Navigation;
