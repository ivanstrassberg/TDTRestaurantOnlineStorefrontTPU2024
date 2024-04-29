import React from 'react'; // Import React library
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import routing components
import logo from './logo.svg'; // Import a logo resource
import './App.css'; // Import styles
import LoginForm from './LoginForm'; // Import your custom login component
import AdminPage from './AdminPage'; // Import your new admin page
// import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';


function App() {
  return (
    <Router> {/* Set up the router */}
      <div className="App">
        <header className="App-header"> {/* Header section */}
          <img src={logo} className="App-logo" alt="logo" /> {/* Logo */}
          <p>
            Welcome to the main page.
            <Link to="/login">Go to Login Page</Link> {/* Navigation link to login */}
            <Link to="/admin">Go to Admin Page</Link> {/* Navigation link to admin */}
          </p>
        </header>

        <Routes> {/* Define routes */}
          <Route path="/login" element={<LoginForm />} /> {/* Route for login */}
          {/* <ProtectedRoute exact path="/admin" component={AdminPage} /> Protected Route */}
          <Route path="/products" element={<ProductList />} /> {/* Home page showing the product list */}
          <Route path="/product/:id" element={<ProductDetail />} /> {/* Dynamic route for product detail */}
          <Route path="/admin" element={<AdminPage />} /> {}
          {/* Add more routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Export the App component
