import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css'; // Import styles
import logo from '../src/css/logo.png';

// Stripe imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

import Footer from './Footer';
import Hero from './Hero';
import MainTest from './MainTest';
import LoginForm from './LoginForm';
import AdminPage from './AdminPage';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import RegisterPage from './RegisterPage';
import CartPage from './CustomerCart';
import UnauthorizedPage from './UnauthorizedPage';
import ProductSearch from './ProductSearch';

// Load Stripe outside of the component's render to avoid recreating the Stripe object on every render
const stripePromise = loadStripe("pk_test_51PGBY6RsvEv5vPVlHUbe5pB27TSwBnFGH7t93QSkoef6FEy1hobnSCmWSJDk3cnQgj1Wrf9TybhyEyu79ZEtuNST00aSiTI6Vg");

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Navigation hook for redirection

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (searchTerm.trim() !== '') {
      // Navigate to the search endpoint with the search term
      navigate(`/search/${searchTerm.trim()}`);
    }
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Logo" width="150" height="45" />
          </Link>
          <div className="navbar-wrap">
            <ul className="navbar-menu">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/products">Menu</Link></li>
            </ul>
            <form onSubmit={handleSearch} className="search-form" style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="text"
                value={searchTerm} // Controlled component
                onChange={(e) => setSearchTerm(e.target.value)} // Update state on input
                placeholder="Search..." // Placeholder text
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '10px', width: '70%' }}
              />
              <button type="submit" style={{ padding: '10px', backgroundColor: 'black', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Search</button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
};

const App = () => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      'X-Authorization': localStorage.getItem('X-Authorization'),
      'email': localStorage.getItem('email'),
      'Authorization': localStorage.getItem('Authorization')
       }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((error) => console.error('Error fetching payment intent:', error));
  }, []);

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <Router>
      <Header /> {/* Include the header component */}
      <ScrollToTop />
      <Routes> {/* Define application routes */}
        <Route path="/" element={<MainTest />} /> {/* Home with product list */}
        <Route path="/admin" element={<AdminPage />} /> {/* Admin page */}
        <Route path="/login" element={<LoginForm />} /> {/* Login form */}
        <Route path="/register" element={<RegisterPage />} /> {/* Registration page */}
        <Route path="/cart" element={<CartPage />} /> {/* Cart page */}
        <Route path="/products" element={<ProductList />} /> {/* Product list */}
        <Route path="/product/:id" element={<ProductDetail />} /> {/* Product detail */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} /> {/* Unauthorized page */}
        <Route path="/search/:key" element={<ProductSearch />} /> {/* Search results */}
        {clientSecret && (
          <Route path="/checkout" element={
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          } />
        )}
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default App;
