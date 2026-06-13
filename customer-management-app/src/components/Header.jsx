import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1>Customer Management System</h1>
          </Link>

          <div>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>Pozdrav, {user?.email}</span>
                <button onClick={logout} className="btn-danger">
                  Odjava
                </button>
                 <button onClick={toggleTheme} className="btn-secondary btn-small">
                        Toggle Theme
                      </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="btn-primary">Prijava</button>
              </Link>
              
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
