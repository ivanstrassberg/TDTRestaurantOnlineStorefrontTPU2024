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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password_hash}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>} {/* Display status message */}
    </div>
  );
};

export default LoginForm;
