import React from 'react'; // Import React library
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import routing components
import logo from './logo.svg'; // Import a logo resource
import './App.css'; // Import styles
import LoginForm from './LoginForm'; // Import your custom login component

function App() {
  return (
    <Router> {/* Set up the router */}
      <div className="App">
        <header className="App-header"> {/* Header section */}
          <img src={logo} className="App-logo" alt="logo" /> {/* Logo */}
          <p>
            Welcome to the main page.
            <Link to="/login">Go to Login Page</Link> {/* Navigation link to login */}
          </p>
        </header>

        <Routes> {/* Define routes with Routes */}
          <Route path="/login" element={<LoginForm />} /> {/* Route for login */}
          {/* Add more routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Export the App component
