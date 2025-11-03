import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, setSingleBuy } = useCart();

  // Handle Buy Now
  const handleBuyNow = () => {
    setSingleBuy(product); // store the single product
    navigate("/payment"); // redirect to payment
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-60 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
      <p className="text-gray-600 mb-2">₹{product.price}</p>

      <div className="flex gap-3">
        <button
          onClick={() => addToCart(product)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium w-full"
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium w-full"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
