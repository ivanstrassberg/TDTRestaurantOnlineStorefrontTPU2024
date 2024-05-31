import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  maxWidth: '800px',
  margin: '20px auto',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
  border: '1px solid #ddd',
};

const imageContainerStyle = {
  flex: '1', // Take up remaining space
  marginRight: '20px', // Add space between image and text
};

const imageStyle = {
  width: '100%', // Make image fill container width
  height: 'auto', // Maintain aspect ratio
  borderRadius: '5px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow for depth
};

const textContainerStyle = {
  flex: '2', // Take up 2/3 of the container
};

const textStyle = {
  marginBottom: '10px', // Add spacing between text elements
};

const buttonStyle = {
  backgroundColor: '#a1bd4d',
  border: 'none',
  borderRadius: '5px',
  color: 'white',
  padding: '10px 20px',
  cursor: 'pointer',
};

const buttonHoverStyle = {
  ...buttonStyle,
  opacity: '0.8',
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <div style={imageContainerStyle}>
        <img src={`/img/${id}.png`} alt={product.name} style={imageStyle} />
      </div>
      <div style={textContainerStyle}>
        <h1>{product.name}</h1>
        <p style={textStyle}>Description: {product.description}</p>
        <p style={textStyle}>Price: {product.price.toFixed(2)} руб.</p>
        <p style={textStyle}>Stock: {product.stock}</p>
        <p style={textStyle}>Rating: {product.rating}</p>
        <button style={inCart ? buttonHoverStyle : buttonStyle} onClick={handleButtonClick} disabled={inCart}>
          {inCart ? "To Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
