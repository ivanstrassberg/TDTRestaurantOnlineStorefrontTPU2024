import React, { useState } from 'react';
import { fetchWithJWT } from './fetchWithJWT'; // Import fetchWithJWT function

const AdminPage = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [message, setMessage] = useState('');

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
          'email': localStorage.getItem('email')
        },
        body: JSON.stringify(newProduct), // Convert product data to JSON
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
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <div>
          <label>Category ID:</label>
          <input
            type="number"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
        </div>
        <button type="submit">Create Product</button>
      </form>
      {message && <p>{message}</p>} {/* Display status message */}
    </div>
  );
};

export default AdminPage;
