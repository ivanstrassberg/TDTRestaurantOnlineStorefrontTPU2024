import React, { useState } from 'react'; // Import React and useState hook

const LoginForm = () => {
  // State variables to hold email and password
  const [email, setEmail] = useState('');
  const [password_hash, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State variable for status messages

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Send HTTP POST request to the backend
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST', // POST request
        headers: {
          'Content-Type': 'application/json', // JSON data format
        },
        body: JSON.stringify({ email, password_hash }), // Data to send
      });

      if (response.ok) { 
        setMessage('Login successful'); // Success response
      } else {
        const data = await response.json();
        setMessage(`Login failed: ${data.message}`); // Handle failure
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`); // Handle errors
    }
  };

  return (
    <div>
      <h2>Login</h2> {/* Component heading */}
      <form onSubmit={handleSubmit}> {/* Form submission handler */}
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password_hash}
            onChange={(e) => setPassword(e.target.value)} // Update state
          />
        </div>
        <button type="submit">Login</button> {/* Submit button */}
      </form>
      {message && <p>{message}</p>} {/* Display status message */}
    </div>
  );
};

export default LoginForm; // Export the component
