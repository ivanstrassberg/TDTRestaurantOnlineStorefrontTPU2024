import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import CategorySlider from './CategorySlider'; // Import CategorySlider component

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  padding: '20px',
};

const cardStyle = {
  flex: '1 0 calc(33.33% - 20px)',
  maxWidth: '400px',
  margin: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '10px',
  display: 'flex',
};

const imageContainerStyle = {
  marginRight: '20px',
};

const imageStyle = {
  width: '200px',
  height: 'auto',
  borderRadius: '10%',
  minWidth: '150px',
};

const textContainerStyle = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};
const h2Style = {
  padding: '20px',

  // marginRight: '20px',
}
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

const categoryEmoji = {
  meals: '🍲',
  drinks: '🥤',
  fruits: '🍎',
};

function ProductCard({ product, inCart, onAddToCart }) {
  const navigate = useNavigate();
  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
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
      <div style={imageContainerStyle}>
        <img src={`/img/${product.id}.png`} alt={product.name} style={imageStyle} />
      </div>
      <div style={textContainerStyle}>
        <Link to={`/product/${product.id}`} style={linkStyle}>
          <h2>{product.name} {categoryEmoji[product.category]}</h2>
        </Link>
        <p>Price: {product.price.toFixed(2)} руб.</p>
        <button style={inCart ? buttonHoverStyle : buttonStyle} onClick={handleButtonClick}>
          {inCart ? "To Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function ProductListRec() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory)
    : products;

  const start = Math.floor(Math.random() * 15);
  const end = Math.min(start + 2, filteredProducts.length);
  const displayedProducts = filteredProducts.slice(start, end);
    
  return (
    <div>
      <h2 style={h2Style}>Ваши персональные рекомендации</h2>
      <div style={containerStyle}>
        {displayedProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            inCart={cart.includes(product.id)} 
            onAddToCart={handleAddToCart} 
          />
        ))}
      </div>
    </div>
  );
}

export default ProductListRec;
