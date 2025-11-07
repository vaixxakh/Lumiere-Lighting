import React from 'react';
import { useCart } from '../Context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Calculate total
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 100;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold mb-4 transition text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 text-center border border-gray-700">
            <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-base sm:text-lg mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition shadow-lg hover:shadow-yellow-500/50 text-sm sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 border border-gray-700 hover:border-yellow-400/50 hover:shadow-yellow-500/20 transition-all duration-300"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg hover:scale-110 transition-transform duration-300"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-base sm:text-lg">{item.name}</h3>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 font-bold text-lg sm:text-xl mt-2">
                      ₹{item.price?.toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3 sm:mt-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-700 hover:bg-gray-600 text-yellow-400 p-1.5 sm:p-2 rounded-lg transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 sm:px-4 py-1 bg-gray-700/50 rounded-lg text-white font-bold text-center min-w-12">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-700 hover:bg-gray-600 text-yellow-400 p-1.5 sm:p-2 rounded-lg transition"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="text-right flex flex-row sm:flex-col justify-between sm:justify-between gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Subtotal</p>
                      <p className="font-bold text-white text-base sm:text-lg">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 h-fit sticky top-4 sm:top-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Order Summary</h3>

              {/* Price Breakdown */}
              <div className="border-t border-gray-700 pt-3 sm:pt-4 mb-3 sm:mb-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>Shipping:</span>
                  <span className="font-semibold text-white">₹{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>Tax (18%):</span>
                  <span className="font-semibold text-white">₹{tax.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-700 pt-3 sm:pt-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-bold text-gray-300">Total:</span>
                  <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <button
                onClick={() => navigate('/payment')}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-2.5 sm:py-3 px-4 rounded-lg transition shadow-lg hover:shadow-yellow-500/50 text-sm sm:text-base mb-2 sm:mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-yellow-400 hover:text-yellow-300 font-semibold py-2 transition text-sm sm:text-base"
              >
                Continue Shopping
              </Link>

              {/* Info */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700">
                <p className="text-xs text-gray-500 text-center">
                  🚚 Free shipping on orders above ₹500
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
