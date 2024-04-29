// src/ProtectedRoute.js
import React from 'react';
import { Redirect, Route } from 'react-router-dom'; // Import Redirect and Route components

const ProtectedRoute = ({ component: Component, ...rest }) => {
  // Check if the JWT token is in localStorage
  const isAuthenticated = !!localStorage.getItem('X-Authorization');

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} /> // Render the protected component if authenticated
        ) : (
          <Redirect to="/login" /> // Redirect to login if not authenticated
        )
      }
    />
  );
};

export default ProtectedRoute; // Export the ProtectedRoute component
