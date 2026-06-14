import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Molimo unesite email i lozinku');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(formData.email, formData.password);
      login(response.access_token, { email: formData.email });
      navigate('/');
    } catch (err) {
      setError('Neispravni podaci za prijavu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body className="p-4">
          <h2 className="mb-4">Prijava</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@email.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="123qweasd"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="dark"
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Prijava...' : 'Prijavi se'}
            </Button>
          </Form>

          <Alert variant="secondary" className="mt-4 mb-0" style={{ fontSize: '0.85rem' }}>
            <strong>Demo korisnik:</strong><br />
            Email: admin@email.com<br />
            Lozinka: 123qweasd
          </Alert>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
