import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userMenuRef = useRef(null); // ref to detect outside click

  useEffect(() => {
    // Get the logged-in user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-center leading-tight">
          <span
            className="block text-4xl font-serif font-extrabold text-black tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}
          >
            Lumiere
          </span>
          <span
            className="block text-lg font-sans text-black tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            L i g h t i n g
          </span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center text-black">
          <Link to="/" className="hover:text-yellow-500 transition">HOME</Link>
          <Link to="/luxuryabout" className="hover:text-yellow-500 transition">ABOUT</Link>
          <Link to="/products" className="hover:text-yellow-500 transition">PRODUCTS</Link>
          <Link to="/collections" className="hover:text-yellow-500 transition">COLLECTIONS</Link>
          <Link to="/contact" className="hover:text-yellow-500 transition">CONTACT US</Link>
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-5 text-black relative">
          <Search className="cursor-pointer hover:text-yellow-500 transition" />
          <Link to="/wishlist">
           <Heart className="cursor-pointer hover:text-yellow-500 transition" />
          </Link >
          <Link to= "/cart">
          <ShoppingCart className="cursor-pointer hover:text-yellow-500 transition" />
          </Link>

          {/* User Section */}
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

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-yellow-500 hover:text-white transition"
                  >
                    Logout
                  </button>
                 
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-black hover:bg-yellow-500 hover:text-white transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-black hover:bg-yellow-500 hover:text-white transition"
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <div className="flex gap-3 text-black">
            <Search className="cursor-pointer hover:text-yellow-500 transition" />
            <Heart className="cursor-pointer hover:text-yellow-500 transition" />
            <ShoppingCart className="cursor-pointer hover:text-yellow-500 transition" />
            <User
              className="cursor-pointer hover:text-yellow-500 transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-black/30 text-black flex flex-col space-y-4 py-4 px-6">
          <Link to="/" className="hover:text-yellow-500 transition">HOME</Link>
          <Link to="/luxuryabout" className="hover:text-yellow-500 transition">ABOUT</Link>
          <Link to="/products" className="hover:text-yellow-500 transition">PRODUCTS</Link>
          <Link to="/collections" className="hover:text-yellow-500 transition">COLLECTIONS</Link>
          <Link to="/contact" className="hover:text-yellow-500 transition">CONTACT US</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
