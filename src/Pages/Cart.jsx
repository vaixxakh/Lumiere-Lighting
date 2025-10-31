import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cart.length} items in cart</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4 mb-4 flex gap-4">
                  {/* Product Image */}
                 <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
                />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-yellow-500 font-bold text-lg">₹{item.price}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h3>
              
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₹{total}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">₹100</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold">₹{Math.round(total * 0.18)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-yellow-500">₹{total + 100 + Math.round(total * 0.18)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/payment')}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/collections"
                className="block text-center text-yellow-500 hover:text-yellow-600 mt-4 font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
