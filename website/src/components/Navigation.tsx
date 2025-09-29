import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Головна', icon: '🏠' },
    { path: '/player', label: 'Гравець', icon: '🎲' },
    { path: '/gm', label: 'Майстер', icon: '🎭' },
    { path: '/glossary', label: 'Глосарій', icon: '📚' },
  ];

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
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
