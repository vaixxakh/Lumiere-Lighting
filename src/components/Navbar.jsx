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

  // Cart & wishlist counts
  const { cartCount, wishlistCount } = useCart();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Search submit handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchItem.trim()) return;
    onSearch(searchItem);
    navigate("/products");
    setShowSearch(false);
  };

  // Close user menu on outside click
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

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-lg border-b border-yellow-500/20 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-3">
        {/* LOGO */}
        <Link to="/" className="flex flex-col items-start leading-tight">
          <span
            className="text-2xl sm:text-3xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-wide"
            style={{ fontFamily: "sans-serif" }}
          >
            Lumiere
          </span>
          <span
            className="text-xs sm:text-sm font-sans text-gray-300 uppercase tracking-widest"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            L i g h t i n g
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-6 items-center font-medium text-gray-300">
          <Link to="/" className="hover:text-yellow-400 transition">HOME</Link>
          <Link to="/luxuryabout" className="hover:text-yellow-400 transition">ABOUT</Link>
          <Link to="/products" className="hover:text-yellow-400 transition">PRODUCTS</Link>
          <Link to="/collections" className="hover:text-yellow-400 transition">CATEGORIES</Link>
          <Link to="/footer" className="hover:text-yellow-400 transition">CONTACT US</Link>
        </div>

        {/* DESKTOP ICONS */}
        <div className="hidden md:flex items-center space-x-6 text-gray-300 relative">
          {showSearch ? (
            <X
              onClick={() => setShowSearch(false)}
              size={22}
              className="cursor-pointer hover:text-yellow-400 transition"
            />
          ) : (
            <Search
              onClick={() => setShowSearch(true)}
              size={22}
              className="cursor-pointer hover:text-yellow-400 transition"
            />
          )}

          {/* Wishlist */}
          <Link to="/wishlist" className="relative">
            <Heart className="cursor-pointer hover:text-red-400 transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="cursor-pointer hover:text-yellow-400 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-semibold rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User dropdown */}
          <div ref={userMenuRef} className="relative flex items-center gap-2">
            <User
              className="cursor-pointer hover:text-yellow-400 transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
            {user && (
              <span className="text-gray-300 font-medium hidden sm:inline">
                Hey, <span className="text-yellow-400">{user.name.split(" ")[0]}</span>
              </span>
            )}

            {showUserMenu && (
              <div className="absolute right-0 top-8 w-36 bg-gray-800 rounded-lg shadow-2xl border border-yellow-500/30 py-2 z-50">
                <Link
                  to="/account"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                >
                  Account
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                >
                  My Orders
                </Link>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400"
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

        {/* MOBILE MENU BUTTONS */}
        <div className="md:hidden flex items-center gap-3 text-gray-300">
          <Search
            onClick={() => setShowSearch(!showSearch)}
            className="cursor-pointer hover:text-yellow-400 transition"
          />
          <Link to="/wishlist" className="relative">
            <Heart className="cursor-pointer hover:text-yellow-400 transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="cursor-pointer hover:text-yellow-400 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-semibold rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV LINKS */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-gray-900 border-t border-yellow-500/20 shadow-2xl py-4 space-y-3 text-gray-300 font-medium">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">HOME</Link>
          <Link to="/luxuryabout" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">ABOUT</Link>
          <Link to="/products" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">PRODUCTS</Link>
          <Link to="/collections" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">CATEGORIES</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">CONTACT US</Link>
          {user ? (
            <button onClick={handleLogout} className="hover:text-yellow-400">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Login</Link>
          )}
        </div>
      )}

      {/* SEARCH BAR OVERLAY */}
      {showSearch && (
        <div className="fixed top-16 left-0 w-full bg-gray-900 px-4 py-2 flex justify-center z-40 shadow-2xl border-b border-yellow-500/20">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-md flex items-center bg-gray-800 border border-yellow-500/30 rounded-full shadow-lg px-4 py-2"
          >
            <input
              type="text"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              placeholder="Search for lights, chandeliers, lamps..."
              className="flex-grow bg-transparent outline-none text-gray-300 placeholder-gray-500 px-2"
            />
            <button type="submit" className="text-yellow-400 hover:text-yellow-500 transition">
              <Search />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
