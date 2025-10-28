import React, { useState } from "react";
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
   <h1 className="text-center leading-tight">
  <span
    className="block text-4xl font-serif font-extrabold  text-black-400 tracking-wide"
    style={{ fontFamily: "'Playfair Display', serif",fontWeight: 900  }}
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
        <div className="hidden md:flex space-x-6 items-center text-black-400">
          <button className="hover:text-yellow-500 transition">HOME</button>
            <button className="hover:text-yellow-500 transition">ABOUT</button>
          <button className="flex items-center gap-1 hover:text-yellow-500 transition">
            SALE <span className="text-yellow-500 text-xs">%</span>
          </button>
           <button className="hover:text-yellow-500 transition">COLLECTIONS</button>
        
          <button className="hover:text-yellow-500 transition">CONTACT US</button>
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
          className="md:hidden text-pink-400 focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-lg border-t border-pink-400/30 text-pink-400 flex flex-col space-y-4 py-4 px-6">
          <button className="hover:text-white transition">Home</button>
          <button className="hover:text-white transition">Collections</button>
          <button className="hover:text-white transition">Sales</button>
          <button className="hover:text-white transition">Contact Us</button>

          <div className="flex justify-around mt-3">
            <Search className="hover:text-white" />
            <Heart className="hover:text-white" />
            <User className="hover:text-white" />
            <ShoppingCart className="hover:text-white" />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
