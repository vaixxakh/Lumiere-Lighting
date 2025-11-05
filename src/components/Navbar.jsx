import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext"; 

function Navbar({ onSearch }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Get cart & wishlist count
  const { cartCount, wishlistCount } = useCart();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchItem.trim()) return;
    onSearch(searchItem);
    navigate("/products");
    setShowSearch(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    navigate("/login");
  };

  //  Navigate to order tracking page
  const handleOrdersClick = () => {
    setShowUserMenu(false);
    navigate("/order-tracking");
  };

  return (
    <nav className="fixed top-0 h-26 px-6 py-2 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="leading-tight mb-15 ml-5 text-center md:text-left">
          <span
            className="block text-3xl sm:text-3xl font-serif font-extrabold text-black tracking-wide"
            style={{ fontFamily: "sans-serif" }}
          >
            Lumiere
          </span>
          <span
            className="ml-4 block text-sm sm:text-sl font-sans text-black tracking-[0.05em] uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            L i g h t i n g
          </span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center text-black font-small">
          <Link to="/" className="hover:text-yellow-500 transition">HOME</Link>
          <Link to="/luxuryabout" className="hover:text-yellow-500 transition">ABOUT</Link>
          <Link to="/products" className="hover:text-yellow-500 transition">PRODUCTS</Link>
          <Link to="/collections" className="hover:text-yellow-500 transition">CATEGORIES</Link>
          <Link to="/contact" className="hover:text-yellow-500 transition">CONTACT US</Link>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex mb-15 ml-5 items-center space-x-6 text-black relative">
          {showSearch ? (
            <X
              onClick={() => setShowSearch(false)}
              size={22}
              className="cursor-pointer hover:text-yellow-500 transition"
            />
          ) : (
            <Search
              onClick={() => setShowSearch(true)}
              size={22}
              className="cursor-pointer hover:text-yellow-500 transition"
            />
          )}

          {/*  Wishlist with counter */}
          <Link to="/wishlist" className="relative">
            <Heart className="cursor-pointer hover:text-red-500 transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/*  Cart with counter */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="cursor-pointer hover:text-yellow-500 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-semibold rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/*  User Dropdown */}
          <div ref={userMenuRef} className="relative flex items-center gap-2">
            <User
              className="cursor-pointer hover:text-yellow-500 transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
            {user && (
              <span className="text-gray-700 font-medium">
                Hey, <span className="text-green-500">{user.name.split(" ")[0]}</span>
              </span>
            )}
            {showUserMenu && (
              <div className="absolute right-15 mt-45 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-4  z-50">
                <button className="hover:text-yellow-600 font-semibold ml-6">
                  Account
                </button>
                <Link to="/orders" className="hover:text-yellow-600 font-semibold ml-3  px-3">
                  My Orders
                  </Link>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="hover:text-yellow-600 font-semibold ml-3  px-3"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-yellow-500 hover:text-white"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 hover:bg-yellow-500 hover:text-white"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Section */}
        <div className="md:hidden flex items-center gap-3 text-black">
          <Search
            onClick={() => setShowSearch(!showSearch)}
            className="cursor-pointer hover:text-yellow-500 transition"
          />
          <div className="relative">
            <Heart className="cursor-pointer hover:text-yellow-500 transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1">
                {wishlistCount}
              </span>
            )}
          </div>
          <div className="relative">
            <ShoppingCart className="cursor-pointer hover:text-yellow-500 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-semibold rounded-full px-1">
                {cartCount}
              </span>
            )}
          </div>
          <User
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="cursor-pointer hover:text-yellow-500 transition"
          />
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/*  Search Bar */}
      {showSearch && (
  <div className="fixed top-7 left-0 w-full flex justify-center z-50">
    <form
      onSubmit={handleSearch}
      className="w-full max-w-md sm:max-w-lg flex items-center bg-white border border-gray-300 rounded-full shadow-md px-4 py-2"
    >
      <input
        type="text"
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        placeholder="Search for lights, chandeliers, lamps..."
        className="flex-grow bg-transparent outline-none text-gray-700 px-2"
      />
      <button
        type="submit"
        className="text-yellow-500 hover:text-yellow-600 transition"
      >
        <Search />
      </button>
    </form>
  </div>
)}
    </nav>
  );
}

export default Navbar;
