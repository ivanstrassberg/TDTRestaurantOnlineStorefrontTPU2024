import React, { useState } from 'react';
import './RegisterPage.css';
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
    <div style={{ textAlign: 'center' }}>
  <h1 style={{ marginBottom: '20px' }}>Register</h1>
  <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
    <div style={{ marginBottom: '10px' }}>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      {emailError && <div style={{ color: 'red', marginTop: '5px' }}>{emailError}</div>}
    </div>
    <div style={{ marginBottom: '10px' }}>
      <label>Password</label>
      <input
        type="password"
        value={password_hash}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
    </div>
    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Register</button>
  </form>

  {generalError && <div style={{ color: 'red', marginTop: '10px' }}>{generalError}</div>}

  {success && (
    <div className="popup" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="popup-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', textAlign: 'center' }}>
        <h2>Registration Successful!</h2>
        <p>Your account has been created. Click below to log in.</p>
        <button onClick={() => window.location.href = '/login'} style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Go to Login</button>
      </div>
    </div>
  )}
</div>

  );
}

export default Registration;
