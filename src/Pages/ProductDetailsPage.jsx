import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Truck, Shield, RefreshCw, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { toast } from 'react-toastify';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted, setSingleBuy } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    axios
      .get(`https://6916c7aba7a34288a27e5552.mockapi.io/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        setLoading(false);
        toast.error('Product not found!');
        navigate('/products');
      });
  }, [id, navigate]);

  const handleAddToCart = () => {
    const productWithQuantity = { ...product, quantity };
    addToCart(productWithQuantity);
    toast.success(`🛒 ${quantity} item(s) added to cart!`, {
      position: 'top-center',
      autoClose: 2000,
      theme: 'colored',
    });
  };

  const handleBuyNow = () => {
    const productWithQuantity = { ...product, quantity };
    setSingleBuy(productWithQuantity);
    navigate('/payment');
  };

  const handleWishlist = () => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    //   toast.info('Removed from wishlist', { autoClose: 1500 });
    } else {
      addToWishlist(product);
    //   toast.success(' Added to wishlist!', { autoClose: 1500 });
    }
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  // Mock multiple images (you can add more images to your product data)
  const productImages = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Products
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-4 aspect-square">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Heart
                  size={24}
                  className={`${
                    wishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-yellow-500 scale-105'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Category Badge */}
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {product.category}
            </span>

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.floor(product.reviews)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 font-semibold">
                {product.reviews.toFixed(1)} / 5.0
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-red-700 mb-2">
                ₹{product.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-bold text-gray-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                Buy Now
              </motion.button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Free Shipping</h4>
                    <p className="text-sm text-gray-600">On orders above ₹5,000</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                    <p className="text-sm text-gray-600">100% secure transactions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RefreshCw className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
