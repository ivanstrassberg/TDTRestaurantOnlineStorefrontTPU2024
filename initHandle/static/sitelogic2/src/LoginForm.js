import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithJWT } from './fetchWithJWT'; // Import fetchWithJWT function

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password_hash, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password_hash }),
      });

      if (response.ok) {
        const data = await response.json(); // Extract response data
        console.log(data);
        // Store JWT token in localStorage
        // if (data.token) {
        localStorage.setItem('X-Authorization', data);
        localStorage.setItem('email', email)
        setMessage('Login successful');
        navigate('/products');
        // }
      } else {
        const data = await response.json();
        setMessage(`Login failed: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>Password:</label>
          <input
            type="password"
            value={password_hash}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Login</button>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>

  );
};

export default LoginForm;
