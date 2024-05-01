import React, { useState } from 'react';
import './css/register.css';
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
            if (data.error === 'the email already in use') {
              setEmailError('The email is already in use'); // Set specific error message
            }
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
        setGeneralError(error.message); // General error handling
      });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <div style={{ color: 'red' }}>{emailError}</div>} {/* Display error above field */}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password_hash}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>

      {generalError && <div style={{ color: 'red' }}>{generalError}</div>} {/* General error handling */}

      {/* Pop-up on successful registration */}
      {success && (
        <div className="popup">
          <div className="popup-content">
            <h2>Registration Successful!</h2>
            <p>Your account has been created. Click below to log in.</p>
            <button onClick={() => window.location.href = '/login'}>Go to Login</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Registration;
