import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';
import { Navbar, Container, Button } from 'react-bootstrap';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Navbar bg="dark" variant="dark" className="px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Customer Management System
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-3">
          {isAuthenticated ? (
            <>
              <Navbar.Text className="text-white">
                Pozdrav, {user?.email}
              </Navbar.Text>
              <Button variant="outline-light" size="sm" onClick={logout}>
                Odjava
              </Button>
              <Button variant="outline-light" size="sm" onClick={toggleTheme}>
                {theme === 'light' ? <BsMoon size={18} /> : <BsSun size={18} />}
              </Button>
            </>
          ) : (
            <Button variant="light" size="sm" as={Link} to="/login">
              Prijava
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
