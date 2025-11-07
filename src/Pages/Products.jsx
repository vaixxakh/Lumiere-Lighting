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
    <section className="py-20 sm:py-24 md:py-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Filter & Sort - RESPONSIVE */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white text-black text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
              className="px-4 py-2 bg-white text-black text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="none">Sort by Price</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>
        </div>


        {/* Product Grid - FULLY RESPONSIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {paginatedProducts.map((product) => {
            const wishlisted = isWishlisted(product.id);
            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-48 sm:h-56 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() =>
                      wishlisted
                        ? removeFromWishlist(product.id)
                        : addToWishlist(product)
                    }
                    className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg"
                  >
                    <Heart
                      size={18}
                      className={`${
                        wishlisted
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>


                {/* Content Section */}
                <div className="p-4">
                  {/* Product Name */}
                  <h2 className="text-sm sm:text-base font-semibold text-black mb-2 line-clamp-2 h-10">
                    {product.name}
                  </h2>


                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 h-9">
                    {product.description}
                  </p>


                  {/* Reviews & Price */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs sm:text-sm text-gray-700 font-semibold">
                        {product.reviews.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-black">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>


                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg text-xs sm:text-sm transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black  font-semibold py-2 rounded-lg text-xs sm:text-sm transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-10 text-base sm:text-lg">
            No products found for this search, category, or sort option.
          </p>
        )}


        {/* Pagination - RESPONSIVE */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors text-sm"
            >
              Prev
            </button>


            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  currentPage === i + 1
                    ? "bg-yellow-500 text-black"
                    : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}


            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors text-sm"
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
