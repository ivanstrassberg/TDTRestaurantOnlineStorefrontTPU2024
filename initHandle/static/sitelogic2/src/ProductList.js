import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '10px',
  margin: '10px',
  backgroundColor: '#f9f9f9'
};

const buttonStyle = {
  backgroundColor: '#a1bd4d',
  border: 'none',
  borderRadius: '5px',
  color: 'white',
  padding: '10px 20px',
  cursor: 'pointer'
};

const buttonHoverStyle = {
  ...buttonStyle,
  opacity: '0.8'
};

function ProductCard({ product, inCart, onAddToCart }) {
  const navigate = useNavigate();
  const linkStyle = {
    textDecoration: 'none', // Remove underline
    color: 'inherit', // Inherit color from parent
  };

  const handleButtonClick = () => {
    if (inCart) {
      navigate('/cart');
    } else {
      onAddToCart(product.id);
    }
  };

  return (
    <div style={cardStyle}>
      <Link to={`/product/${product.id}`} style={linkStyle}>
        <h2>{product.name}</h2>
        <p>Price: {product.price.toFixed(2)}руб.</p>
      </Link>
      <button style={buttonStyle} onClick={handleButtonClick}>
        {inCart ? "To Cart" : "Add to Cart"}
      </button>
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
    
    fetch('http://localhost:8080/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('X-Authorization'),
        'email': localStorage.getItem('email'),
      },
    })
      .then((response) => response.json())
      .then((cartData) => {
        setCart(cartData.map(item => item.id));
      })
      .catch((error) => {
        console.error('Error fetching cart:', error);
      });
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/cart/add/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': localStorage.getItem('X-Authorization'),
          'email': localStorage.getItem('email'),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      setCart(prevCart => [...prevCart, productId]);
      console.log('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          inCart={cart.includes(product.id)} 
          onAddToCart={handleAddToCart} 
        />
      ))}
    </div>
  );
}

export default ProductList;
