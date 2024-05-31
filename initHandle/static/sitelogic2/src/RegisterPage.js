import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // Import the CSS file

function Registration() {
  const [email, setEmail] = useState('');
  const [password_hash, setPassword] = useState('');
  const [success, setSuccess] = useState(false); // Track registration success
  const [emailError, setEmailError] = useState(null); // Specific error for email field
  const [generalError, setGeneralError] = useState(null); // General error message

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form default behavior
  
    // Reset errors before sending the request
    setEmailError(null);
    setGeneralError(null);
  
    fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password_hash }),
    })
      .then((response) => {
        if (response.status === 400) {
          return response.json().then((data) => {
            setGeneralError('Registration failed: Bad request'); // Set general error message for 400 errors
            throw new Error('Bad request');
          });
        } else if (!response.ok) {
          throw new Error('Registration failed');
        }
  
        return response.json(); // Convert to JSON if successful
      })
      .then(() => {
        setSuccess(true); // Set success if registration succeeds
      })
      .catch((error) => {
        if (error.message !== 'Bad request') {
          setGeneralError(error.message); // General error handling
        }
      });
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <div className="message">{emailError}</div>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password_hash}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Register</button>
        <br></br>
        <br></br>
        <Link to="/login" className="register-link">Уже знакомы?</Link>
      </form>
  
      {generalError && <div className="message">{generalError}</div>}
  
      {success && (
        <div className="popup">
          <div className="popup-content">
            <h2>Registration Successful!</h2>
            <p>Your account has been created. Click below to log in.</p>
            <button onClick={() => window.location.href = '/login'} className="login-button">Go to Login</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Registration;
