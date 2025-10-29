import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/products") // Adjust path if needed
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (id) => {
    setCart((prev) => [...prev, id]);
  };

  const buyNow = (id) => {
    alert(`Proceed to buy product ID: ${id}`);
  };

  return (
    <section className="py-27 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">
          Shop Our Premium Collection
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden relative group"
            >
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition"
              >
                <Heart
                  size={22}
                  className={`transition ${
                    wishlist.includes(product.id)
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </button>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <p className="mt-2 text-gray-600 flex-grow">{product.description}</p>
                <div className="mt-3 flex items-center space-x-3">
                  <span className="text-yellow-400 font-semibold">
                    ★ {product.reviews.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    | {product.price.toLocaleString('USD', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => addToCart(product.id)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => buyNow(product.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
