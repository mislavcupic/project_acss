import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BsSun, BsMoon } from 'react-icons/bs';
import { Navbar, Container, Button } from 'react-bootstrap';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar bg={theme === 'light' ? 'light' : 'dark'} variant={theme === 'light' ? 'light' : 'dark'} className="px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Customer Management System</Navbar.Brand>
        <div className="d-flex align-items-center gap-3">
          {isAuthenticated ? (
            <>
              <Navbar.Text>Pozdrav, {user?.email}</Navbar.Text>
              <Button variant={theme === 'light' ? 'outline-dark' : 'outline-light'} size="sm" onClick={logout}>
                Odjava
              </Button>
              <Button variant={theme === 'light' ? 'outline-dark' : 'outline-light'} size="sm" onClick={toggleTheme}>
                {theme === 'light' ? <BsMoon size={18} /> : <BsSun size={18} />}
              </Button>
            </>
          ) : (
            <Button variant={theme === 'light' ? 'dark' : 'light'} size="sm" as={Link} to="/login">
              Prijava
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;