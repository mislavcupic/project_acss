import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';

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
    <div className="login-container">
      <div className="login-box">
        <h2>Prijava</h2>
        
        {error && (
          <div style={{ 
            padding: '10px', 
            background: '#fee', 
            color: '#c33',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@email.com"
            />
          </div>

          <div className="form-group">
            <label>Lozinka</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="123qweasd"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Prijava...' : 'Prijavi se'}
          </button>
        </form>

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '10px', 
          background: '#f0f0f0',
          borderRadius: '4px',
          fontSize: '0.85rem'
        }}>
          <strong>Demo korisnik:</strong><br />
          Email: admin@email.com<br />
          Lozinka: 123qweasd
        </div>
      </div>
    </div>
  );
};

export default Login;
