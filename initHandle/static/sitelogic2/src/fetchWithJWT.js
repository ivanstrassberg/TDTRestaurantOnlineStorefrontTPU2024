// src/fetchUtil.js

export const fetchWithJWT = async (url, options = {}) => {
    const token = localStorage.getItem('X-Authorization'); // Retrieve the token
  
    const headers = {
      ...options.headers, // Include existing headers
      'X-Authorization': token, // Add JWT token to the headers
    };
  
    const response = await fetch(url, {
      ...options, // Include any other options
      headers, // Set headers with token
    });
  
    return response; // Return the response
  };
  