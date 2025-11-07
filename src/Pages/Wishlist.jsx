import React, { useEffect, useState } from 'react';
import { useCart } from '../Context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';

function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && !alertShown) {
      alert('Please login to access the feature');
      setAlertShown(true);
      navigate('/login');
    }
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold mb-6 transition"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-400">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-12 text-center border border-gray-700">
            <Heart size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-6">Your wishlist is empty</p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-8 rounded-lg transition shadow-lg hover:shadow-yellow-500/50"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 border border-gray-700 hover:border-yellow-400/50 hover:scale-105"
              >
                {/* Product Image Container */}
                <div className="relative overflow-hidden h-48 sm:h-56 bg-black">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                  {/* Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-5 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-yellow-400 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-5">
                    ₹{product.price?.toLocaleString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2 text-sm sm:text-base group/btn"
                    >
                      <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px] group-hover/btn:rotate-12 transition-transform" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/30 text-sm sm:text-base group/btn"
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px] group-hover/btn:scale-110 transition-transform" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Bottom Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
