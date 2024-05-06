import { useNavigate } from "react-router-dom";


export const useAuthFetch = (url, options = {}) => {
  const navigate = useNavigate(); // Custom hook for navigation context

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Authorization': localStorage.getItem('X-Authorization'), // JWT token
    'email': localStorage.getItem('email'),
  };

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers, // Allow additional headers if needed
    },
  };

  return fetch(url, fetchOptions).then((response) => {
    if (response.status === 401) {
      navigate('/unauthorized'); // Use navigation context for redirect
    }

    return response; // Return the response for further handling
  });
};
