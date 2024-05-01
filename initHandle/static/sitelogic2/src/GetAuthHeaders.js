function getAuthHeaders() {
    return {
      'Content-Type': 'application/json', // Set the content type to JSON
      'X-Authorization': localStorage.getItem('X-Authorization'), // Get the token from localStorage
      'email': localStorage.getItem('email'), // Get the email from localStorage
    };
  }

export default getAuthHeaders;