import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import LuxuryShop from "./components/products/LuxuryShop";
import LuxuryProducts from "./components/products/LuxuryProducts";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import Payment from "./Pages/Payment";
import OrderTrack from "./Pages/OrderTrack";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login to access this feature");
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={1500} />
      <Navbar onSearch={handleSearch} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/luxuryabout" element={<LuxuryShop />} />
        <Route path="/collections" element={<LuxuryProducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/track/:orderId" element={<OrderTrack />} />

        {/* Protected routes */}
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

        {/* ✅ Pass searchTerm to ProductsPage */}
        <Route
          path="/products"
          element={<Products searchTerm={searchTerm} />}
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
