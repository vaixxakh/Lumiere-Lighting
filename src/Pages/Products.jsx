import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductsPage = ({ searchTerm }) => {
  const { addToWishlist, removeFromWishlist, isWishlisted, addToCart, setSingleBuy } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");

  //  Pagination States
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

  //  Filter, Sort & Search logic (using prop searchTerm)
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

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <section className="py-35 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Filter & Sort */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex space-x-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-yellow-400"
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
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-yellow-400"
            >
              <option value="none">Sort by Price</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>
        </div>

        {/*  Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {paginatedProducts.map((product) => {
            const wishlisted = isWishlisted(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden relative group"
              >
                {/* Wishlist */}
                <button
                  onClick={() =>
                    wishlisted
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product)
                  }
                  className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md"
                >
                  <Heart
                    size={22}
                    className={`${
                      wishlisted
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  />
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-gray-600 flex-grow">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center space-x-3">
                    <span className="text-green-600 font-semibold">
                      ★ {product.reviews.toFixed(1)}
                    </span>
                    <span className="text-red-700">₹{product.price}</span>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
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

        {/*  No Products Found */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No products found for this search, category, or sort option.
          </p>
        )}

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-yellow-400 disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  currentPage === i + 1
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-gray-200 hover:bg-yellow-400"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-yellow-400 disabled:opacity-50"
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
