import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // ✅ FIXED import

const ProductsPage = () => {
  const { addToWishlist, removeFromWishlist, isWishlisted, addToCart, setSingleBuy } = useCart(); // ✅ added setSingleBuy
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // ✅ FIXED navigation hook

  // ✅ Add to Cart with Toast
  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("🛒 Item added to cart!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#000",
        color: "#FFD700",
        fontWeight: "bold",
        borderRadius: "8px",
      },
    });
  };

  // ✅ Handle Buy Now
  const handleBuyNow = (product) => {
    setSingleBuy(product); // store product in context
    navigate("/payment");  // go to payment page
  };

  // ✅ Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => {
        console.log("Products fetched:", res.data);
        setProducts(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <section className="py-27 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => {
            const wishlisted = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden relative group"
              >
                {/* Wishlist Button */}
                <button
                  onClick={() =>
                    wishlisted
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product)
                  }
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition"
                >
                  <Heart
                    size={22}
                    className={`transition ${
                      wishlisted
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400 hover:text-yellow-500"
                    }`}
                  />
                </button>

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />

                {/* Product Info */}
                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-gray-600 flex-grow">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center space-x-3">
                    <span className="text-yellow-400 font-semibold">
                      ★ {product.reviews.toFixed(1)}
                    </span>
                    <span className="text-gray-500">₹{product.price}</span>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)} // ✅ FIXED
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
