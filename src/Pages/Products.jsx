import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart, ShoppingCart, Zap, Star } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductsPage = ({ searchTerm }) => {
  const { addToWishlist, removeFromWishlist, isWishlisted, addToCart, setSingleBuy } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("🛒 Item added to cart!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });
  };

  const handleBuyNow = (product) => {
    setSingleBuy(product);
    navigate("/payment");
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "All" ? true : p.category === selectedCategory
    )
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <section className="py-20 sm:py-24 md:py-35 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Filter & Sort - RESPONSIVE */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-800 text-white text-sm border border-yellow-500/30 rounded-xl shadow-lg focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
            >
              <option value="All">All Categories</option>
              <option value="Chandeliers">Chandeliers</option>
              <option value="Pendant">Pendant</option>
              <option value="Floor Light">Floor Light</option>
              <option value="Ceiling Light">Ceiling Light</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-800 text-white text-sm border border-yellow-500/30 rounded-xl shadow-lg focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
            >
              <option value="none">Sort by Price</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid - FULLY RESPONSIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {paginatedProducts.map((product) => {
            const wishlisted = isWishlisted(product.id);
            return (
              <div
                key={product.id}
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 border border-yellow-500/10 hover:border-yellow-500/50 hover:scale-105"
              >
                {/* Premium Badge - RESPONSIVE */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Star size={10} className="sm:w-3 sm:h-3" fill="black" />
                    <span className="hidden sm:inline">PREMIUM</span>
                  </div>
                </div>

                {/* Wishlist Button - RESPONSIVE */}
                <button
                  onClick={() =>
                    wishlisted
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product)
                  }
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 bg-black/70 backdrop-blur-md rounded-full p-2 sm:p-2.5 shadow-xl hover:bg-black/90 transition-all duration-300 hover:scale-110"
                >
                  <Heart
                    size={16}
                    className={`sm:w-[18px] sm:h-[18px] ${
                      wishlisted
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    } transition-colors duration-300`}
                  />
                </button>

                {/* Image - RESPONSIVE HEIGHT */}
                <div className="relative overflow-hidden h-48 sm:h-56 md:h-64 lg:h-72 bg-black">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  {/* Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Content Section - RESPONSIVE PADDING */}
                <div className="p-4 sm:p-5 md:p-6">
                  {/* Product Name - RESPONSIVE TEXT */}
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-yellow-400 transition-colors duration-300">
                    {product.name}
                  </h2>

                  {/* Description - RESPONSIVE TEXT */}
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Reviews & Price - RESPONSIVE */}
                  <div className="flex items-center justify-between mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-700">
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-yellow-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-yellow-500/30">
                      <Star size={12} className="sm:w-[14px] sm:h-[14px] text-yellow-400 fill-yellow-400" />
                      <span className="text-xs sm:text-sm font-bold text-yellow-400">
                        {product.reviews.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - RESPONSIVE */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-1.5 sm:gap-2 group/btn"
                    >
                      <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px] group-hover/btn:rotate-12 transition-transform" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-gray-500/30 flex items-center justify-center gap-1.5 sm:gap-2 border border-gray-600 hover:border-yellow-500/50 group/btn"
                    >
                      <Zap size={14} className="sm:w-[18px] sm:h-[18px] text-yellow-400 group-hover/btn:rotate-12 transition-transform" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            );
          })}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-400 mt-10 text-base sm:text-lg">
            No products found for this search, category, or sort option.
          </p>
        )}

        {/* Pagination - RESPONSIVE */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 sm:mt-12 gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-yellow-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed font-semibold transition-all duration-300 border border-gray-700 hover:border-yellow-500"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg sm:rounded-xl font-bold transition-all duration-300 ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/50"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:border-yellow-500/50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-yellow-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed font-semibold transition-all duration-300 border border-gray-700 hover:border-yellow-500"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
