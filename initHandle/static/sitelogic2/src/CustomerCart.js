import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CartPage = () => {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/cart', {
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
          throw new Error(`Failed to fetch cart: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Expected an array of products");
        }

        // Initialize default quantities if not already provided
        const initializedProducts = data.map((product) => ({
          ...product,
          quantity: product.quantity || 1,
        }));

        setProducts(initializedProducts);
      })
      .catch((err) => {

            setError(err.message); // Set other errors
          
      });
  }, []);

  const increaseQuantity = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && product.quantity < product.stock
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const handleDelete = (productId) => {
    fetch(`http://localhost:8080/cart/delete/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('X-Authorization'),
        'email': localStorage.getItem('email'),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete product: ${response.status}`);
        }
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {products.length === 0 ? (
            <li>Your cart is empty</li>
          ) : (
            products.map((product) => (
              <li key={product.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/product/${product.id}`);
                  }}
                >
                  {product.name} - ${product.price.toFixed(2)}
                </a>
                <div>
                  <button onClick={() => decreaseQuantity(product.id)}> - </button>
                  <span>{product.quantity}</span>
                  <button onClick={() => increaseQuantity(product.id)}> + </button>
                </div>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
