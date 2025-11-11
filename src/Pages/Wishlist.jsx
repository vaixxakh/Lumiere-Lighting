
import { useCart } from '../Context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';


function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id); 
  };


  return (
    <div className="min-h-screen bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold mb-6 transition"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>


        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-6">Your wishlist is empty</p>
            <Link
              to="/products"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300"
              >
                {/* Product Image Container */}
                <div className="relative overflow-hidden h-48 sm:h-56 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-90 transition-all duration-500"
                  />
                </div>


                {/* Product Info */}
                <div className="p-5 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-black mb-2 line-clamp-1">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600 mb-5">
                    ₹{product.price?.toLocaleString()}
                  </p>


                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-red-300 text-sm sm:text-base"
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default Wishlist;
