import React, { useState } from "react";
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react";
import { Link } from 'react-router-dom'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
   <h1 className="text-center leading-tight">
  <span
    className="block text-4xl font-serif font-extrabold  text-black-400 tracking-wide"
    style={{ fontFamily: "'Playfair Display', serif",fontWeight: 800  }}
  >
   Lumiere
  </span>
  <span
    className="block text-lg font-sans text-black-300 tracking-[0.2em] uppercase"
    style={{ fontFamily: "'Montserrat', sans-serif" }}
  >
    L i g h t i n g
  </span>
</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex  space-x-6 items-center text-black-400">
          <Link to="/"  className="hover:text-yellow-500 transition">HOME</Link>
            <Link to='/luxuryabout' className="hover:text-yellow-500 transition">ABOUT</Link>
              <Link to='/products' className="flex items-center gap-1 hover:text-yellow-500 transition">
               PRODUCTS 
                 </Link>
             <Link to='/collections' className="hover:text-yellow-500 transition">COLLECTIONS</Link>
          <Link to='/contact' className="hover:text-yellow-500 transition">CONTACT US</Link>
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-5 text-black-400">
          <Search className="cursor-pointer hover:text-yellow-500 transition" />
          <Heart className="cursor-pointer hover:text-yellow-500 transition" />
          <ShoppingCart className="cursor-pointer hover:text-yellow-500 transition" />
          <User className="cursor-pointer hover:text-yellow-500 transition" />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-black-400 focus:outline-none"
        >
          <div className="flex justify-around mt-3">
            <Search className="hover:text-white" />
            <Heart className="hover:text-white" />
            <User className="hover:text-white" /> 
            <ShoppingCart className="hover:text-white" />
          </div>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-black-400/30 text-black-400 flex flex-col space-y-4 py-4 px-6">
         <Link to="/" className="hover:text-yellow-500 transition">HOME</Link>
          <Link to="/products" className="hover:text-yellow-500 transition">PRODUCTS</Link>
          <Link to="/collections" className="hover:text-yellow-500 transition">COLLECTIONS</Link>
          <Link to="/contact" className="hover:text-yellow-500 transition">CONTACT US</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
