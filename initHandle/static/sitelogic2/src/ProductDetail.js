import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Fetching product details and adding to cart
function ProductDetail() {
  const { id } = useParams(); // Get the dynamic route parameter
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch the product details by ID
    fetch(`http://localhost:8080/product/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Product not found');
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data[0]);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/cart/add/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': localStorage.getItem('X-Authorization'), // Pass JWT token
          'email': localStorage.getItem('email'), // Pass email
        },
        // body: JSON.stringify({ id: id }), // Pass product ID
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      console.log('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  if (!product) {
    return <div>Product does not exist</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Description: {product.description}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Stock: {product.stock}</p>
      <p>Rating: {product.rating}</p>

      <button onClick={handleAddToCart}>Add to Cart</button> {/* Button to add to cart */}
    </div>
  );
}

export default ProductDetail;
