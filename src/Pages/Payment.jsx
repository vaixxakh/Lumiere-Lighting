import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Lock, Loader, ArrowLeft, Package } from "lucide-react";

function Payment() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    createOrder,
    singleBuy,
    setSingleBuy,
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    zipCode: "",
    paymentMethod: "cod",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    bankName: "",
    accountNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return alert("Please enter your full name."), false;
    if (!/^\d{10}$/.test(formData.phoneNumber.trim())) return alert("Enter a valid 10-digit phone number."), false;
    if (!formData.addressLine.trim()) return alert("Enter your address."), false;
    if (!formData.city.trim()) return alert("Enter your city."), false;
    if (!/^\d{5,6}$/.test(formData.zipCode.trim())) return alert("Enter valid ZIP code."), false;

    if (formData.paymentMethod === "card") {
      if (!formData.cardName.trim() || !formData.cardNumber.trim() || !formData.expiryDate.trim() || !formData.cvv.trim())
        return alert("Please fill all card details."), false;
    }
    if (formData.paymentMethod === "upi") {
      if (!formData.upiId.trim()) return alert("Enter a valid UPI ID."), false;
    }
    if (formData.paymentMethod === "netbank") {
      if (!formData.bankName.trim() || !formData.accountNumber.trim())
        return alert("Enter your bank name and account number."), false;
    }

    return true;
  };

  const itemsToOrder = singleBuy
    ? [{ ...singleBuy, quantity: singleBuy.quantity || 1 }]
    : cart || [];

  const total = itemsToOrder.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const shipping = 100;
  const tax = Math.round(total * 0.18);
  const grandTotal = total + shipping + tax;

  const handlePayment = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);

    const newOrderId = createOrder({
      items: itemsToOrder,
      shipping: {
        fullName: formData.fullName,
        phone: formData.phoneNumber,
        addressLine: formData.addressLine,
        city: formData.city,
        zipCode: formData.zipCode,
      },
      paymentMethod: formData.paymentMethod,
      totals: {
        subtotal: total,
        shipping,
        tax,
        grandTotal,
      },
    });

    setTimeout(() => {
      if (!singleBuy) {
        (cart || []).forEach((item) => removeFromCart(item.id));
      } else {
        setSingleBuy(null);
      }

      setProcessing(false);
      setOrderPlaced(true);
      setSuccessMessage(newOrderId);

      setTimeout(() => {
        navigate(`/track/${newOrderId}`);
      }, 4000);
    }, 2000);
  };

  // Empty cart
  if (itemsToOrder.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
        <div className="text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 sm:p-12 border border-gray-700">
          <Package size={64} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-8 rounded-lg transition shadow-lg hover:shadow-yellow-500/50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Success screen with animation
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes scaleIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes shimmer {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          .animate-slide-up { animation: slideUp 0.6s ease-out; }
          .animate-scale-in { animation: scaleIn 0.5s ease-out; }
          .animate-bounce-custom { animation: bounce 1s infinite; }
          .animate-shimmer { animation: shimmer 2s infinite; }
        `}</style>

        <div className="text-center w-full max-w-md">
          {/* Confetti effect circles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-shimmer"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 sm:p-12 border border-yellow-500/30 backdrop-blur-sm animate-scale-in relative z-10">
            <CheckCircle
              size={80}
              className="mx-auto text-green-400 mb-6 animate-bounce-custom"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 animate-slide-up">
              Order Placed Successfully! ✨
            </h1>
            <p className="text-gray-300 text-base sm:text-lg mb-4">
              Order ID: <span className="font-bold text-yellow-400">{successMessage}</span>
            </p>
            <p className="text-gray-400 text-sm sm:text-base mb-2 animate-shimmer">
              Thank you for your purchase!
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Redirecting to track order...
            </p>

            {/* Loading bar */}
            <div className="mt-6 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full"
                style={{
                  animation: "slideRight 3s ease-in-out forwards",
                  "@keyframes slideRight": {
                    "0%": { width: "0%" },
                    "100%": { width: "100%" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Processing animation
  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
        <style>{`
          @keyframes pulse-scale {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          .animate-pulse-scale { animation: pulse-scale 1.5s infinite; }
        `}</style>

        <div className="text-center">
          <div className="mb-8">
            <Lock size={80} className="mx-auto text-yellow-400 animate-pulse-scale" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Processing Payment
          </h2>
          <p className="text-gray-400 mb-8 text-sm sm:text-base">
            Please wait while we secure your transaction...
          </p>

          {/* Animated loader */}
          <div className="flex justify-center items-center gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-yellow-400 rounded-full"
                style={{
                  animation: `bounce 1.4s infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          {/* Progress indicator */}
          <div className="w-64 sm:w-80 mx-auto">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Validating</span>
              <span>Processing</span>
              <span>Confirming</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full"
                style={{
                  animation: "slideRight 1.8s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out; }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #fbbf24;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in-down">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold mb-4 transition text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Back to Cart
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2 flex items-center gap-2">
            <Lock size={32} className="sm:w-10 sm:h-10" />
            Secure Checkout
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Your payment is encrypted and secure</p>
        </div>

        <form
          onSubmit={handlePayment}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in-down"
        >
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Shipping Address */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                📍 Shipping Address
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                />
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number (10 digits)"
                  className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                />
                <input
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="Address Line"
                  className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                  />
                  <input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                    className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                💳 Payment Method
              </h2>
              <div className="space-y-3 mb-4 sm:mb-6">
                {[
                  { value: "cod", label: "Cash on Delivery" },
                  { value: "card", label: "Card (Credit/Debit)" },
                  { value: "upi", label: "UPI" },
                  { value: "netbank", label: "Net Banking" },
                ].map((method) => (
                  <label key={method.value} className="flex items-center gap-3 cursor-pointer p-2 sm:p-3 hover:bg-gray-700/50 rounded-lg transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer accent-yellow-400"
                    />
                    <span className="font-medium text-gray-300 text-sm sm:text-base">{method.label}</span>
                  </label>
                ))}
              </div>

              {/* Conditional Payment Inputs */}
              <div className="space-y-3 sm:space-y-4">
                {formData.paymentMethod === "card" && (
                  <>
                    <input
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="Cardholder Name"
                      className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                    />
                    <input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="Card Number (16 digits)"
                      className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <input
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="Expiry (MM/YY)"
                        className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                      />
                      <input
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="CVV (3 digits)"
                        className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                      />
                    </div>
                  </>
                )}

                {formData.paymentMethod === "upi" && (
                  <input
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="Enter your UPI ID (e.g., yourname@upi)"
                    className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                  />
                )}

                {formData.paymentMethod === "netbank" && (
                  <>
                    <input
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="Bank Name"
                      className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                    />
                    <input
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="Account Number"
                      className="w-full border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-2.5 sm:p-3 transition"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 rounded-lg transition shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {processing ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Place Order Securely
                </>
              )}
            </button>
          </div>

          {/* Right Section: Order Summary */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 h-fit sticky top-4 sm:top-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              📦 Order Summary
            </h3>

            {/* Items List */}
            <div className="space-y-2 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-600 max-h-48 sm:max-h-64 overflow-auto">
              {itemsToOrder.map((item) => (
                <div key={item.id} className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span className="line-clamp-2">{item.name}</span>
                  <span className="font-bold text-gray-300">
                    ₹{((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm mb-4 sm:mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span className="text-white">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping:</span>
                <span className="text-white">₹{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax (18%):</span>
                <span className="text-white">₹{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-600 pt-3 sm:pt-4 flex justify-between">
                <span className="font-bold text-gray-300">Total:</span>
                <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 sm:p-3">
              <p className="text-xs text-green-400 flex items-center gap-2">
                <Lock size={14} />
                100% Secure Payment
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Payment;
