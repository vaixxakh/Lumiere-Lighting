import React from 'react';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Footer from './components/Footer';
import { Routes, Route, Navigate } from 'react-router-dom';
import Products from './Pages/Products';
import LuxuryShop from './components/products/LuxuryShop';
import LuxuryProducts from './components/products/LuxuryProducts';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Wishlist from './Pages/Wishlist';
import Cart from './Pages/Cart';
import Payment from './Pages/Payment';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderTrack from "./Pages/OrderTrack";

function App() {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    alert('Please login to access this feature');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};


  return (
    
    <div>
       <>
      {/* Your Navbar and Routes here */}
      <ToastContainer position="top-center" autoClose={1500} />
    </>
    
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/luxuryabout" element={<LuxuryShop />} />
        <Route path="/collections" element={<LuxuryProducts />} />
        <Route path="/login" element={<Login />} />
         <Route path="/payment" element={<Payment />} />
  <Route path="/track/:orderId" element={<OrderTrack />} />
        <Route path="/signup" element={<SignUp />} />
        <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } 
          />
        {/* Protected routes - require login */}
        <Route path="/products" element={user ? <Products /> : <Navigate to="/login" />} />
      </Routes>

      <Footer />
    </div>
  );
}


export default App;
