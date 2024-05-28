import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate(); 
  navigate('/unauthorized');
  // Navigation hook for redirection
  useEffect(() => {
    navigate('/unauthorized');
    fetch('http://localhost:8080/admin', { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('X-Authorization'),
        'email': localStorage.getItem('email'),
      },
    })
    
    .then((response) => {
      if (response.status === 401) {
        navigate('/unauthorized');
      }
      if (!response.ok) {

        navigate('/unauthorized');
      }
      return response.json();
    })
      .catch((error) => {
        console.error("Error checking authorization:", error); 
        navigate('/unauthorized');
      });
  }, [navigate]); 
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(true); // Authorization flag


  const handleStockChange = (e) => {
    const value = e.target.value;
    setStock(value === '' ? '' : parseInt(value, 10)); // Handle empty input
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setRating(value === '' ? '' : parseFloat(value)); // Ensure proper conversion
  };

  const handleCategoryIdChange = (e) => {
    const value = e.target.value;
    setCategoryId(value === '' ? '' : parseInt(value, 10)); // Handle empty input
  };


  if (!isAuthorized) {
    return null; 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      name: productName,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      rating: parseFloat(rating),
      category_id: parseInt(categoryId, 10),
    };

    try {
      const response = await fetch('http://localhost:8080/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': localStorage.getItem('X-Authorization'),
          'email': localStorage.getItem('email'),
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setMessage('Product created successfully');
      } else {
        setMessage('Failed to create product');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`); // Handle exceptions
    }
  };

  return (
    <div>
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            step="0.1"
            value={[rating]} // Controlled component
            onChange={handlePriceChange} // Ensure conversion
          />
        </div>
        <div>
          <label>Stock:</label>
          <input
            type="number"
            value={stock} // Controlled component
            onChange={handleStockChange} // Proper handling of empty input
          />
        </div>
        <div>
          {/* <label>Rating:</label>
          <input
            type="number"
            step="0.1"
            value={rating} // Controlled component
            onChange={handleRatingChange} // Ensure conversion
          /> */}
        </div>
        <div>
          <label>Category ID:</label>
          <input
            type="number"
            value={categoryId} // Controlled component
            onChange={handleCategoryIdChange} // Ensure conversion
          />
        </div>
        <button type="submit">Create Product</button>
      </form>
      {message && <p>{message}</p>} {/* Display status message */}
    </div>
  );
};

export default AdminPage;
