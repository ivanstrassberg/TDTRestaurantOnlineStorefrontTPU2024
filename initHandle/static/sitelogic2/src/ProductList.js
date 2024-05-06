import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css'; // Import the CSS for styling

function ProductCard({ product }) {
  return (
    <div className="card">
      <h2>{product.name}</h2>
      <p>Price: ${product.price.toFixed(2)}</p>
      <Link to={`/product/${product.id}`}>View Details</Link> {/* Link to product detail */}
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/products') 
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []); // Run once on component mount

  return (
    <div className="product-list-container">
      {/* <h1>Products</h1> */}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} /> // Display each product as a card
      ))}
    </div>
  );
}

export default ProductList;
