import React, { useState, useEffect,useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css'; // Import styles
import '../src/css/logo.png';

// Stripe imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// import Footer from './Footer';
import Hero from './Hero';
import MainTest from './MainTest';
import LoginForm from './LoginForm';
import AdminPage from './AdminPage';
import ProductList from './ProductList';
import Orders from './Orders';
import ProductDetail from './ProductDetail';
import RegisterPage from './RegisterPage';
import CartPage from './CustomerCart';
import UnauthorizedPage from './UnauthorizedPage';
import ProductSearch from './ProductSearch';
import RenderHtmlPage from './RenderHTML';
import ProductListRec from './ProductListRec'
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51PGBY6RsvEv5vPVlHUbe5pB27TSwBnFGH7t93QSkoef6FEy1hobnSCmWSJDk3cnQgj1Wrf9TybhyEyu79ZEtuNST00aSiTI6Vg");

  const Header = () => {
    const svgIcon = (
      <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.875 0C16.875 6.44062 0 3.22031 0 16.1016C0 20.932 1.875 22.5422 1.875 22.5422H3.75C3.75 22.5422 0.9375 20.932 0.9375 16.1016C0.9375 12.8812 9.375 9.66094 9.375 9.66094C9.375 9.66094 1.89375 13.1453 1.89375 16.4526C13.8309 18.0579 20.4394 6.12342 16.8741 0H16.875Z" fill="#7C9827"/>
      </svg>
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('X-Authorization') !== null;

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchTerm.trim() !== '') {
        navigate(`/search/${searchTerm.trim()}`);
      }
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [menuRef]);

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem('X-Authorization');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp < Date.now() / 1000) {
            localStorage.removeItem('X-Authorization');
            setMenuOpen(false);
            navigate('/login');
          }
        }
      };

      const interval = setInterval(checkAuth, 60000);
      return () => clearInterval(interval);
    }, [navigate]);

    return (
      <header className="header">
        <nav className="navbar">
          <div className="container">
            <div className="navbar-wrap">
              <div className="logo">
                <Link to="/">{svgIcon}</Link>
              </div>
              <div className="desktop-menu">
                <ul className="navbar-menu">
                {/* <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                  />
                  <button type="submit">Search</button>
                </form> */}
                  <li><Link to="/">Главная</Link></li>
                  <li><Link to="/cart">Корзина</Link></li>
                  <li><Link to="/products">Меню</Link></li>
                  {!isLoggedIn && (
                    <>
                      <li><Link to="/login">Войти</Link></li>
                      {/* <li><Link to="/register">Register</Link></li> */}
                    </>
                  )}
                  {isLoggedIn && (
                    <li className="profile-menu">
                      <img
                        src="https://via.placeholder.com/50"
                        alt="Profile"
                        className="profile-img"
                        onClick={() => setMenuOpen(!menuOpen)}
                      />
                      {menuOpen && (
                        <div className="profile-dropdown" ref={menuRef}>
                          <ul>
                            <li><Link to="/orders">Заказы</Link></li>
                            <li><Link to="/settings">Настройки</Link></li>
                            <li>
                              <button onClick={() => {
                                localStorage.removeItem('X-Authorization');
                                setMenuOpen(false);
                                navigate('/')
                              }}>Выйти</button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </li>
                  )}
                </ul>
                
                
              </div>
              <div className="mobile-menu-toggle">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  <span>☰</span>
                </button>
                {mobileMenuOpen && (
                  <div className="mobile-menu">
                    <ul>
                      <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Главная</Link></li>
                      {!isLoggedIn && (
                        <>
                          <li><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Войти</Link></li>
                          {/* <li><Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link></li> */}
                        </>
                      )}
                      
                      <li><Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Корзина</Link></li>
                      <li><Link to="/products" onClick={() => setMobileMenuOpen(false)}>Меню</Link></li>
                      <br></br>
                      {isLoggedIn && (
                        <>
                          <li><Link to="/orders" onClick={() => setMobileMenuOpen(false)}>Заказы</Link></li>
                          <li><Link to="/settings" onClick={() => setMobileMenuOpen(false)}>Настройки</Link></li>
                          <li>
                            <button onClick={() => {
                              localStorage.removeItem('X-Authorization');
                              setMobileMenuOpen(false);
                              navigate('/')
                            }}>Выйти</button>
                          </li>
                        </>
                      )}
                    </ul>
                    {/* <form onSubmit={handleSearch} className="search-form">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                      />
                      <button type="submit">Search</button>
                    </form> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  };
function App() {
  const [clientSecret, setClientSecret] = useState("");



  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#05e197',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Router>
      <Header /> {/* Include the header component */}
      <ScrollToTop />
      <ScrollToTopRec/>
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
        <Route path="/orders" element={<Orders />} />
        
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
  if (pathname !== '/') {
    return null;
  }
  return <Hero />;
};

const ScrollToTopRec = () => {
  const { pathname } = useLocation();
  if (pathname !== '/') {
    return null;
  }
  return <ProductListRec/>;
};


export default App;
