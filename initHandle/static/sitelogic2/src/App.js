import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Import styles
import LoginForm from './LoginForm';
import AdminPage from './AdminPage';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import RegisterPage from './RegisterPage';
import CartPage from './CustomerCart';
import UnauthorizedPage from './UnauthorizedPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <nav className="navbar">
            <div className="container">
              <p className="navbar-brand">
                <img src={('./logo.png')} alt="Logo" className="logo_img" />

              </p>
              <div className="navbar-wrap">
                <ul className="navbar-menu">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/admin">Admin</Link></li>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                  <li><Link to="/cart">Cart</Link></li>
                  <li><Link to="/products">Products</Link></li>
                </ul>
              </div>
            </div>
          </nav>
        </header>


        <Routes> {/* Define application routes */}
          <Route path="/" element={<ProductList />} /> {/* Home with product list */}
          <Route path="/admin" element={<AdminPage />} /> {/* Admin page */}
          <Route path="/login" element={<LoginForm />} /> {/* Login form */}
          <Route path="/register" element={<RegisterPage />} /> {/* Registration page */}
          <Route path="/cart" element={<CartPage />} /> {/* Cart page */}
          <Route path="/products" element={<ProductList />} /> {/* Product list */}
          <Route path="/product/:id" element={<ProductDetail />} /> {/* Product detail */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} /> {/* Unauthorized page */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
