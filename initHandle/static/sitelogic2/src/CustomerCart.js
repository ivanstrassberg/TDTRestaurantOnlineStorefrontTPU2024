import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [products, setProducts] = useState([]); // Initialize as an array
  const [error, setError] = useState(null); // Error handling
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    fetch('http://localhost:8080/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('X-Authorization'), // JWT token
        'email': localStorage.getItem('email'),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch cart: ${response.status}`);
        }
        return response.json(); // Convert response to JSON
      })
      .then((data) => {
        if (!Array.isArray(data)) { // Ensure data is an array
          throw new Error("Expected an array of products");
        }
        setProducts(data); // Set data to state
      })
      .catch((err) => {
        console.error("Error fetching cart products:", err);
        setError(err.message); // Store error message
      });
  }, []);

  return (
    <div>
      <h1>Your Cart</h1>
      {error ? (
        <p>Error: {error}</p> // Display error message
      ) : (
        <ul>
          {products.length === 0 ? (
            <li>Your cart is empty</li> // Message for empty cart
          ) : (
            products.map((product) => (
              <li key={product.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    navigate(`/product/${product.id}`); // Navigate to product details
                  }}
                >
                  {product.name} - ${product.price.toFixed(2)}
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default CartPage;
