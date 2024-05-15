import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css'; // Import styles
import '../src/css/logo.png'

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
import ProductSearch from './ProductSearch'

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
          <p className="navbar-brand">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="150.000000pt" height="45.000000pt" viewBox="0 0 695.000000 115.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,115.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                <path d="M2863 932 c-35 -74 -41 -81 -72 -87 -51 -10 -141 -45 -141 -56 0 -12 2 -12 81 12 39 12 72 19 75 16 3 -3 -20 -76 -52 -162 -54 -146 -59 -157 -86 -162 -41 -8 -49 -27 -9 -21 29 4 32 3 27 -16 -35 -121 -57 -225 -54 -259 3 -42 3 -42 47 -45 52 -4 167 20 266 55 74 26 115 53 82 53 -10 0 -31 -7 -46 -14 -27 -14 -223 -68 -288 -80 -47 -8 -55 9 -37 85 8 35 26 101 39 145 l25 82 102 12 c162 19 191 24 196 39 3 9 -2 11 -14 7 -26 -7 -267 -36 -271 -32 -7 6 107 320 118 327 16 9 138 27 243 35 87 7 88 7 82 -15 -3 -11 -9 -30 -12 -42 -5 -19 -12 -20 -107 -18 -71 2 -102 -1 -105 -9 -3 -9 23 -12 97 -12 56 0 101 -3 101 -7 0 -5 -7 -44 -15 -88 -36 -185 -56 -482 -35 -515 7 -10 10 18 10 87 0 101 17 254 46 408 23 127 7 115 155 115 80 0 128 4 124 10 -3 5 -58 9 -122 9 -64 0 -118 3 -120 5 -6 6 26 108 38 120 13 14 11 46 -2 46 -6 0 -18 -18 -27 -40 l-17 -40 -75 0 c-42 0 -113 -5 -159 -10 -46 -6 -86 -9 -88 -6 -3 2 7 35 22 71 38 96 22 93 -22 -3z" />
                <path d="M725 962 c-71 -44 -242 -253 -372 -454 -43 -66 -79 -115 -81 -109 -2 6 3 64 12 129 32 244 31 332 -7 356 -42 26 -142 -133 -188 -299 -31 -109 -34 -295 -5 -322 18 -17 18 -17 6 6 -20 40 -7 219 24 324 44 149 132 293 165 273 15 -10 14 -115 -4 -281 -19 -180 -19 -215 0 -215 8 0 61 71 119 158 163 245 327 429 375 420 13 -3 16 -16 14 -72 -4 -110 -49 -364 -108 -605 -31 -123 -53 -226 -51 -228 15 -15 117 382 151 580 53 316 41 395 -50 339z" />
                <path d="M3892 953 c-5 -10 -17 -42 -27 -72 -53 -162 -178 -396 -244 -455 -28 -26 -34 -17 -22 35 6 24 6 48 2 52 -5 5 -35 -1 -67 -11 -32 -11 -78 -22 -100 -26 l-41 -6 -7 40 c-15 97 -138 84 -135 -14 0 -23 -3 -53 -6 -69 -20 -79 89 -76 130 4 10 19 23 29 38 29 20 0 89 16 145 34 21 7 22 5 22 -43 0 -43 3 -51 19 -51 40 0 138 135 197 272 15 37 29 66 30 65 2 -1 -4 -34 -12 -72 -43 -207 -69 -430 -56 -480 7 -24 10 -10 16 65 13 177 90 567 130 662 9 21 16 42 16 48 0 16 -18 12 -28 -7z m-536 -418 c28 -43 3 -78 -43 -61 -13 5 -14 9 -5 18 21 21 13 31 -12 15 -38 -25 -50 -1 -16 33 27 27 56 25 76 -5z m4 -87 c0 -16 -59 -70 -73 -65 -15 5 -21 31 -13 61 5 19 11 21 46 18 22 -2 40 -8 40 -14z" />
                <path d="M5618 946 c-188 -67 -372 -303 -409 -523 -54 -326 201 -401 468 -138 78 77 133 162 133 206 0 44 -84 50 -195 13 -45 -15 -90 -42 -82 -50 2 -2 36 7 77 20 109 35 168 42 176 23 20 -52 -158 -246 -281 -306 -123 -61 -237 -42 -265 44 -16 47 -16 148 -1 215 19 81 93 227 148 292 103 120 238 203 322 196 31 -3 36 -7 39 -30 2 -15 -4 -40 -12 -57 -18 -35 -19 -41 -7 -41 11 0 41 73 41 99 0 48 -72 66 -152 37z" />
                <path d="M6657 939 c-8 -13 -25 -53 -37 -87 l-23 -64 -98 4 c-61 2 -99 -1 -99 -7 0 -6 39 -11 90 -13 49 -1 90 -5 90 -8 0 -11 -126 -254 -157 -304 -46 -72 -92 -120 -116 -120 -17 0 -18 5 -13 35 4 20 16 57 27 82 11 25 18 50 17 55 -2 5 -34 -20 -71 -56 -74 -72 -104 -84 -93 -38 4 15 16 39 26 54 27 36 26 51 -2 42 -59 -19 -125 -34 -149 -34 -22 0 -28 7 -38 40 -18 60 -63 78 -102 39 -15 -15 -20 -29 -15 -50 3 -17 -2 -45 -15 -74 -24 -54 -23 -123 3 -139 36 -22 107 46 128 124 9 34 12 36 93 55 l83 20 -20 -53 c-32 -88 6 -95 93 -16 23 20 41 34 41 31 0 -2 -7 -24 -15 -48 -28 -77 4 -114 63 -74 37 27 114 144 180 275 35 69 61 116 58 105 -24 -93 -60 -468 -50 -520 12 -66 19 -43 20 68 2 120 13 217 45 395 l21 112 130 0 c83 0 127 4 123 10 -4 6 -57 10 -125 10 l-119 0 15 53 c9 28 22 63 31 76 10 15 12 26 5 33 -7 7 -15 2 -25 -13z m-679 -392 c6 -6 13 -24 17 -40 7 -25 5 -27 -24 -27 -33 0 -39 8 -19 28 9 9 9 12 1 12 -7 0 -15 -4 -18 -10 -11 -18 -25 -10 -25 14 0 34 46 50 68 23z m11 -93 c2 -2 0 -19 -3 -39 -8 -43 -60 -105 -88 -105 -19 0 -20 5 -16 53 2 28 12 64 22 79 15 23 23 26 49 21 18 -3 34 -7 36 -9z" />
                <path d="M4596 931 c-3 -4 -19 -43 -35 -86 -17 -42 -63 -133 -103 -200 l-73 -124 -39 1 c-23 0 -48 -7 -64 -19 -54 -40 -88 -149 -59 -188 15 -20 15 -20 39 2 13 12 46 58 73 102 45 72 53 79 75 74 23 -5 24 -4 7 9 -18 13 -16 18 33 98 29 47 50 78 47 69 -96 -297 -148 -539 -116 -539 6 0 9 7 5 15 -18 49 143 598 209 711 25 43 33 84 16 84 -6 0 -12 -4 -15 -9z m-226 -427 c0 -10 -109 -172 -120 -179 -17 -11 -23 25 -11 65 19 63 73 117 119 119 6 1 12 -2 12 -5z" />
                <path d="M2183 652 c-27 -27 -68 -59 -92 -71 l-43 -22 -19 20 c-23 25 -42 27 -63 6 -23 -23 -9 -45 29 -45 24 0 35 -5 40 -19 7 -24 -11 -106 -32 -141 -17 -30 -66 -63 -77 -53 -21 21 11 117 54 161 12 13 20 26 17 28 -3 3 -47 -15 -99 -40 -160 -76 -268 -95 -268 -46 0 25 48 69 83 77 15 3 27 10 27 16 0 17 -61 -2 -93 -29 -70 -59 -243 -122 -267 -98 -5 5 -1 27 10 51 l19 43 -25 13 -25 13 21 19 c26 23 27 55 1 55 -22 0 -51 -35 -51 -61 0 -31 -250 -133 -312 -127 -30 3 -33 6 -36 41 -4 43 -10 43 -85 5 -22 -11 -41 -17 -45 -14 -8 8 28 46 61 63 24 12 31 12 44 1 14 -11 15 -11 11 2 -8 25 -47 23 -88 -4 -41 -27 -59 -61 -41 -79 8 -8 23 -5 56 11 57 28 65 28 65 -1 0 -33 19 -47 62 -47 40 0 175 48 267 94 61 31 97 28 86 -7 -4 -12 -8 -38 -9 -57 l-1 -35 45 1 c38 2 77 14 188 61 7 3 12 -3 12 -16 0 -32 43 -45 105 -30 53 12 192 65 213 82 16 13 15 7 -9 -47 -11 -26 -19 -61 -17 -79 4 -44 42 -49 87 -11 47 39 64 80 65 151 1 37 5 63 12 63 5 0 32 14 58 31 27 16 52 27 56 22 4 -4 19 -43 34 -86 l27 -78 -70 -74 c-100 -106 -119 -185 -46 -193 92 -11 167 95 147 208 l-9 50 51 34 c28 18 58 36 66 39 12 4 12 6 1 6 -8 1 -39 -13 -69 -30 -30 -17 -55 -29 -56 -27 -7 9 -56 158 -56 169 0 7 12 25 26 40 16 17 22 29 15 33 -6 4 -32 -15 -58 -42z m-808 -102 c-10 -11 -20 -18 -23 -15 -3 3 3 14 13 25 10 11 20 18 23 15 3 -3 -3 -14 -13 -25z m643 12 c3 -9 -3 -13 -19 -10 -12 1 -24 9 -27 16 -3 9 3 13 19 10 12 -1 24 -9 27 -16z m238 -244 c-13 -70 -83 -142 -131 -136 -50 7 -18 91 66 177 l54 55 9 -31 c4 -18 6 -47 2 -65z" />
                <path d="M3620 659 c0 -11 5 -17 10 -14 6 3 10 13 10 21 0 8 -4 14 -10 14 -5 0 -10 -9 -10 -21z" />
                <path d="M3917 519 c-19 -11 -47 -60 -47 -83 0 -23 29 -46 59 -46 15 0 42 11 61 25 37 27 31 33 -10 10 -28 -16 -76 -20 -84 -7 -3 5 11 16 30 25 34 17 56 51 47 75 -6 14 -31 15 -56 1z m43 -19 c0 -6 -12 -22 -26 -35 -45 -42 -60 -28 -23 19 20 26 49 35 49 16z" />
                <path d="M4568 503 c-23 -26 -51 -100 -44 -118 9 -25 33 -17 92 31 36 29 54 40 50 28 -67 -164 7 -164 255 -3 124 81 141 108 22 34 -152 -95 -210 -126 -246 -132 -33 -5 -37 -3 -37 16 0 11 12 50 26 86 15 36 24 68 21 71 -2 3 -35 -24 -71 -61 -73 -71 -103 -83 -92 -37 4 15 16 40 27 55 24 33 21 57 -3 30z" />
              </g>
            </svg>
          </p>
          <div className="navbar-wrap">
            <ul className="navbar-menu">
              <li><Link to="/">Home</Link></li>
              {/* <li><Link to="/admin">Admin</Link></li> */}
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
      </Routes>
      <Footer />
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

export default App;
