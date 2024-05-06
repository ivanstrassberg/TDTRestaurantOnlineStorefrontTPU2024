import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate(); // For navigation back to a safe page

  const handleGoHome = () => {
    navigate('/'); // Redirect to the home page or another safe page
  };

  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>
        You do not have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <button onClick={handleGoHome}>Go to Home</button> {/* Button to navigate back */}
    </div>
  );
};

export default UnauthorizedPage;
