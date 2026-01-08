import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';
import { loginAPI } from '../services/authAPI';

function Logins() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/inventory');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginAPI({ email, password });
    
    if (result && result.status === 200) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('userEmail', result.data.user?.email || email);
      navigate('/inventory');
    } else {
      setError(result?.data?.message || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-dark p-4">
      <div className="rounded p-5 w-100" style={{ backgroundColor: '#000000', maxWidth: '400px' }}>
        <h1 className="text-white text-center fw-bold mb-2" style={{ fontSize: '32px' }}>Login</h1>
        <p className="text-white text-center mb-4" style={{ fontSize: '14px', opacity: 0.8 }}>
          Enter access codes for the Enterprise Hub.
        </p>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" className="text-center mb-3">
              {error}
            </Alert>
          )}
          
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="form-control bg-dark text-white border-secondary mb-3" 
            style={{ padding: '14px 16px' }} 
            disabled={loading}
            autoComplete="email"
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="form-control bg-dark text-white border-secondary mb-3" 
            style={{ padding: '14px 16px', backgroundColor: '#000000' }} 
            disabled={loading}
            minLength={6}
            autoComplete="current-password"
          />
          
          <Button 
            type="submit" 
            className="w-100 fw-bold text-uppercase bg-white text-black" 
            style={{ padding: '14px' }} 
            disabled={loading}
          >
            {loading ? 'AUTHORIZING...' : 'AUTHORIZE'}
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Logins;
