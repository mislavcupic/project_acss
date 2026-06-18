import { useAuth } from '../context/AuthContext';
import { Container, Card, Badge } from 'react-bootstrap';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container className="mt-4">
        <p className="text-muted">Podaci o korisniku nisu dostupni.</p>
      </Container>
    );
  }

  const formatDate = (unixSeconds) => {
    if (!unixSeconds) return '-';
    return new Date(unixSeconds * 1000).toLocaleString('hr-HR');
  };

  const avatarUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email || 'guest')}`;

  return (
    <Container className="mt-4" style={{ maxWidth: '500px' }}>
      <h2 className="mb-3">Profil korisnika</h2>
      <Card>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-center mb-4">
            <img
              src={avatarUrl}
              alt="Profilna slika"
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          </div>

          <p className="mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="mb-2">
            <strong>Rola:</strong>{' '}
            <Badge bg={user.role === 'admin' ? 'dark' : 'secondary'}>
              {user.role}
            </Badge>
          </p>
          <p className="mb-2 text-muted small">
            Prijavljen: {formatDate(user.iat)}
          </p>
          <p className="mb-0 text-muted small">
            Token istječe: {formatDate(user.exp)}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;