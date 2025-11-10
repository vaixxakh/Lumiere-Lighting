import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react";
import { Link, useNavigate,useLocation} from "react-router-dom";
import { useCart } from "../Context/CartContext";

function Navbar({ onSearch = () => {} }) {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const userMenuRefMobile = useRef(null);

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
const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.location.reload(); // Force full refresh if already in home
    } else {
      navigate("/"); // Normal navigate if not in home
    }
  };
  // Close user menu on outside click (fixed condition)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (!userMenuRef.current || !userMenuRef.current.contains(event.target)) &&
        (!userMenuRefMobile.current || !userMenuRefMobile.current.contains(event.target))
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   const handleNavClick = (path) => {
    if (location.pathname === path) {
      window.location.reload(); // Refresh if same route
    } else {
      navigate(path); // Navigate if different
    }
  };
   const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    navigate("/login");
  };


  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-3">
        {/* LOGO */}
        <Link to="/" onClick={() => handleNavClick("/")} className="flex flex-col items-start leading-tight">
          <span className="text-2xl sm:text-3xl font-extrabold text-black  tracking-wide font-serif">
            Lumiere
          </span>
          <span className="text-xs sm:text-sm text-gray-600 uppercase tracking-widest font-sans">
            L i g h t i n g
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-6 items-center font-medium text-gray-700">
          <Link to="/" onClick={() => handleNavClick("/")} className="hover:text-yellow-600 transition">HOME</Link>
          <Link to="/about" onClick={() => handleNavClick("/about")} className="hover:text-yellow-600 transition">ABOUT</Link>
          <Link to="/products" onClick={() => handleNavClick("/products")} className="hover:text-yellow-600 transition">PRODUCTS</Link>
          <Link to="/collections" onClick={() => handleNavClick("/collections")}  className="hover:text-yellow-600 transition">CATEGORIES</Link>
          {/* ✅ Fixed contact link */}
          <Link to="/contact" onClick={() => handleNavClick("/contact")} className="hover:text-yellow-600 transition">CONTACT US</Link>
        </div>

        {/* DESKTOP ICONS */}
        <div className="hidden md:flex items-center space-x-6 text-gray-700 relative">
          {showSearch ? (
            <X
              onClick={() => setShowSearch(false)}
              size={22}
              className="cursor-pointer hover:text-yellow-600 transition"
            />
          ) : (
            <Search
              onClick={() => setShowSearch(true)}
              size={22}
              className="cursor-pointer hover:text-yellow-600 transition"
            />
          )}

          {/* Wishlist */}
          <Link to="/wishlist" className="relative">
            <Heart className="cursor-pointer hover:text-red-600 transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="cursor-pointer hover:text-yellow-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-semibold rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User dropdown - Desktop */}
          <div ref={userMenuRef} className="relative flex items-center gap-2">
            <User
              className="cursor-pointer hover:text-yellow-600 transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
            {user && (
              <span className="text-gray-700 font-medium hidden sm:inline">
                Hey, <span className="text-yellow-500">{user.name.split(" ")[0]}</span>
              </span>
            )}

            {showUserMenu && (
              <div className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  to="/account"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                >
                  Account
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                >
                  My Orders
                </Link>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
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
        <div className="md:hidden flex items-center gap-3 text-gray-700">
          <Search
            onClick={() => setShowSearch(!showSearch)}
            className="cursor-pointer hover:text-yellow-600 transition"
          />
          <Link to="/wishlist" className="relative">
            <Heart className="cursor-pointer hover:text-yellow-600 transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="cursor-pointer hover:text-yellow-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-semibold rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* MOBILE USER ICON */}
          <div ref={userMenuRefMobile} className="relative">
            <User
              className="cursor-pointer hover:text-yellow-600 transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />

            {showUserMenu && (
              <div className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      Account
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV LINKS */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-white border-t border-gray-200 shadow-lg py-4 space-y-3 text-gray-700 font-medium">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-yellow-600">HOME</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-yellow-600">ABOUT</Link>
          <Link to="/products" onClick={() => setIsOpen(false)} className="hover:text-yellow-600">PRODUCTS</Link>
          <Link to="/collections" onClick={() => setIsOpen(false)} className="hover:text-yellow-600">CATEGORIES</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-yellow-600">CONTACT US</Link>
        </div>
      )}

      {/* SEARCH BAR OVERLAY */}
      {showSearch && (
        <div className="fixed top-16 left-0 w-full bg-white px-4 py-2 flex justify-center z-40 shadow-lg border-b border-gray-200">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-md flex items-center bg-gray-100 border border-gray-300 rounded-full shadow-sm px-4 py-2"
          >
            <input
              type="text"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              placeholder="Search for lights, chandeliers, lamps..."
              className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500 px-2"
            />
            <button type="submit" className="text-yellow-600 hover:text-yellow-700 transition">
              <Search />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
