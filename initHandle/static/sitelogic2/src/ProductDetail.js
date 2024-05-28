import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const containerStyle = {
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
  border: '1px solid #ddd',
  maxWidth: '600px',
  margin: '20px auto'
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

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Add the useNavigate hook
  const [product, setProduct] = useState(null);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
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
        setInCart(cartData.some(item => item.id === parseInt(id)));
      })
      .catch((error) => {
        console.error('Error fetching cart:', error);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/cart/add/${id}`, {
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

      setInCart(true);
      console.log('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleButtonClick = () => {
    if (inCart) {
      navigate('/cart');
    } else {
      handleAddToCart();
    }
  };

  if (!product) {
    return <div>Product does not exist</div>;
  }

  return (
    <div style={containerStyle}>
      <h1>{product.name}</h1>
      <p>Description: {product.description}</p>
      <p>Price: {product.price.toFixed(2)} руб.</p>
      <p>Stock: {product.stock}</p>
      <p>Rating: {product.rating}</p>
      <button style={inCart ? buttonHoverStyle : buttonStyle} onClick={handleButtonClick} disabled={inCart && !inCart}>
        {inCart ? "To Cart" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductDetail;
