import React from 'react';
import Navbar from './components/shared/Navbar';
import Home from './Pages/Home';
import Footer from './components/shared/Footer';
import { Routes, Route, Navigate } from 'react-router-dom';
import Products from './Pages/Products';
import LuxuryLightShop from './components/features/products/LuxuryLightShop';
import LuxuryProducts from './components/features/products/LuxuryProducts';
import Auth from './Authentification/Auth';
import UserDetails from './Pages/UserDetails';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      {/* Show Navbar only when user is logged in */}
      {user && <Navbar />}

      <Routes>
        {/* Protected routes - require login */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
        <Route path="/products" element={user ? <Products /> : <Navigate to="/auth" />} />
        <Route path="/userdetails" element={user ? <UserDetails /> : <Navigate to="/auth" />} />

        {/* Public routes */}
        <Route path="/luxuryabout" element={<LuxuryLightShop />} />
        <Route path="/collections" element={<LuxuryProducts />} />

        {/* Auth route - redirect to home if already logged in */}
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
