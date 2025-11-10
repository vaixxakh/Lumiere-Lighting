import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import LuxuryProducts from "./components/products/LuxuryProducts";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import Payment from "./Pages/Payment";
import OrderTrack from "./Pages/OrderTrack";
import Orders from "./Pages/Orders";
import Account from "./Pages/Account";
import Contact from './Pages/Contact'
import About from './Pages/About'
import ProductDetailsPage from "./Pages/ProductDetailsPage";
// Admin Pages
import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminProducts from "./Pages/admin/AdminProducts";
import AdminOrders from "./Pages/admin/AdminOrders";
import AdminUsers from "./Pages/admin/AdminUsers";
import AdminLogin from "./Pages/admin/AdminLogin";
import AdminRoute from "./components/AdminRoute";



// ✅ PROTECTED ROUTE COMPONENT
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

// ✅ ADMIN PROTECTED ROUTE COMPONENT
const AdminProtected = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken || adminToken !== "true") {
    toast.error("Admin access required", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// ✅ LAYOUT WRAPPER COMPONENT
const Layout = ({ children }) => {
  const location = useLocation();
  
  // ✅ Pages where Navbar & Footer should NOT appear
  const NO_LAYOUT_PAGES = [
    "/login",
    "/signup",
    "/admin/login",
    "/payment",
    "/account"
  ];
  
  // ✅ Hide layout for admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isNoLayoutPage = NO_LAYOUT_PAGES.includes(location.pathname);
  const shouldHideLayout = isAdminRoute || isNoLayoutPage;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Hide on login, signup, admin pages */}
      {!shouldHideLayout && <Navbar />}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - Hide on login, signup, admin pages */}
    
    </div>
  );
};

//  MAIN APP COMPONENT
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer 
        position="top-center" 
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* App Layout with Routes */}
      <Layout>
        <Routes>
          {/* ============================================
              PUBLIC ROUTES (No Auth Required)
              ============================================ */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collections" element={<LuxuryProducts />} />
          <Route path="/products" element={<Products searchTerm={searchTerm} />} />
           <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track/:orderId" element={<OrderTrack />} />

          {/* ============================================
              AUTH ROUTES (No Layout)
              ============================================ */}
          <Route path="/login" element={<Login onSearch={handleSearch} />} />
          <Route path="/signup" element={<SignUp onSearch={handleSearch} />} />

          {/* ============================================
              PROTECTED USER ROUTES (Auth Required)
              ============================================ */}
       
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
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
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
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

          {/* ============================================
              ADMIN ROUTES (Admin Auth Required)
              ============================================ */}
                  {/* ============================================ */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <AdminProtected>
                <AdminLayout />
              </AdminProtected>
            }
          >
            {/* Each admin page is now wrapped with AdminRoute */}
            <Route
              index
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />

            <Route
              path="orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />

            <Route
              path="users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
          </Route>


          {/* CATCH-ALL (404 Not Found) */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div className="text-center">
                  <h1 className="text-5xl font-bold text-yellow-400 mb-4">404</h1>
                  <p className="text-gray-400 text-xl mb-6">Page not found</p>
                  <a 
                    href="/" 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 px-8 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </Layout>
      {location.pathname === "/" && <Footer />}
    </>
  );
}

export default App;
