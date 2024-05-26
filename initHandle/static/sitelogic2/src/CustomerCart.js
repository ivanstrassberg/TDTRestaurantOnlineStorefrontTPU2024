import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css'; // Import the CSS file for styling
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe("pk_test_51PGBY6RsvEv5vPVlHUbe5pB27TSwBnFGH7t93QSkoef6FEy1hobnSCmWSJDk3cnQgj1Wrf9TybhyEyu79ZEtuNST00aSiTI6Vg");

const CartPage = () => {
  const [products, setProducts] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('X-Authorization'),
        'email': localStorage.getItem('email'),
        'Authorization': localStorage.getItem('Authorization') 
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
          navigate('/unauthorized');
          throw new Error("Expected an array of products");
        }
        const productsWithQuantity = data.map((product) => ({
          ...product,
          quantity: 1,
        }));
        setProducts(productsWithQuantity);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [navigate]);

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
          throw Error(`Failed to delete product: ${response.status}`);
        }
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleCheckout = () => {
    const cartItems = products.map((product) => ({
      productID: product.id,
      quantity: product.quantity,
    }));

    fetch('http://localhost:8080/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('X-Authorization'),
        'email': localStorage.getItem('email'),
        'Authorization': localStorage.getItem('Authorization'),
      },
      body: JSON.stringify(cartItems),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(`Failed to checkout product: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      {error ? (
        <p className="cart-error">Error: {error}</p>
      ) : (
        <>
          <ul className="cart-list">
            {products.length === 0 ? (
              <li className="cart-empty">Your cart is empty</li>
            ) : (
              products.map((product) => (
                <li className="cart-item" key={product.id}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    {product.name} - ${product.price.toFixed(2)}
                  </a>
                  <div className="cart-quantity">
                    <button onClick={() => decreaseQuantity(product.id)}> - </button>
                    <span>{product.quantity}</span>
                    <button onClick={() => increaseQuantity(product.id)}> + </button>
                  </div>
                  <button
                    className="cart-delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="cart-total">
            <h2>Total: ${total.toFixed(2)}</h2>
          </div>
        </>
      )}
      {clientSecret ? (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <button
          className="cart-checkout"
          onClick={() => handleCheckout()}
        >Checkout</button>
      )}
    </div>
  );
};

export default CartPage;
