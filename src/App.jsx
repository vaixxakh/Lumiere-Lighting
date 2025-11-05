import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Orders from './Pages/Orders';

import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminProducts from "./Pages/admin/AdminProducts";
import AdminOrders from "./Pages/admin/AdminOrders";
import AdminUsers from "./Pages/admin/AdminUsers";
import AdminLogin from "./Pages/admin/AdminLogin";

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  
  if (!user) {
    toast.warning("Please login to access this feature", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AdminProtected = ({ children }) => {
  const isAdmin = localStorage.getItem("adminToken") === "true";
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={1500} />

      {/* ✅ Only show Navbar on non-admin routes */}
       {!isAdminRoute && <Navbar onSearch={setSearchTerm} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/luxuryabout" element={<LuxuryShop />} />
        <Route path="/collections" element={<LuxuryProducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/track/:orderId" element={<OrderTrack />} />
        <Route path="/products" element={<Products searchTerm={searchTerm} />} />

        {/* Protected User Routes */}
           <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtected><AdminLayout /></AdminProtected>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route
  path="/orders"
  element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  }
/>
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


      </Routes>

      {/* ✅ Only show Footer on non-admin routes */}
       {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
