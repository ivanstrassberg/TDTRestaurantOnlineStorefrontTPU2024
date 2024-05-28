import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

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
  
      // Check if the request method is POST to ensure it's not a preflight request
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('X-Authorization', data['X-Authorization']);
        localStorage.setItem('Authorization', data['Authorization']);
        localStorage.setItem('email', email);
  
        if (localStorage.getItem('X-Authorization') && localStorage.getItem('X-Authorization') !== '') {
          setMessage('Login successful');
          navigate('/products');
        } else {
          setMessage('Login failed: Invalid token received');
        }
      } else {
        const data = await response.json();
        setMessage(`Login failed: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="login-container">
      <h2>Войти</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Электронная почта:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password_hash}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">Войти</button>
      </form>
      {message && <p className="message">{message}</p>}
      <Link to="/register" className="register-link">Впервые? Зарегистрируйтесь!</Link>
    </div>
  );
};

export default LoginForm;
