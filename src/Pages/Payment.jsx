import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

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

  // ✅ Validate base shipping + method-specific fields
  const validateForm = () => {
    if (!formData.fullName.trim()) return alert("Please enter your full name."), false;
    if (!/^\d{10}$/.test(formData.phoneNumber.trim())) return alert("Enter a valid 10-digit phone number."), false;
    if (!formData.addressLine.trim()) return alert("Enter your address."), false;
    if (!formData.city.trim()) return alert("Enter your city."), false;
    if (!/^\d{5,6}$/.test(formData.zipCode.trim())) return alert("Enter valid ZIP code."), false;

    // Payment method–specific validation
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

  // ✅ Calculate totals
  const itemsToOrder = singleBuy
    ? [{ ...singleBuy, quantity: singleBuy.quantity || 1 }]
    : cart || [];

  const total = itemsToOrder.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const shipping = Math.round(total * 0.05) || 100;
  const tax = Math.round(total * 0.18);
  const grandTotal = total + shipping + tax;

  // ✅ Payment handler
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

    // Simulate delay
    setTimeout(() => {
      if (!singleBuy) {
        (cart || []).forEach((item) => removeFromCart(item.id));
      } else {
        setSingleBuy(null);
      }

      setProcessing(false);
      setOrderPlaced(true);

      // Wait for animation, then redirect
      setTimeout(() => {
        navigate(`/track/${newOrderId}`);
      }, 3000);
    }, 1200);
  };

  // 🛒 Empty cart
  if (itemsToOrder.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ✅ Success screen with animation
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 animate-fadeIn">
        <div className="text-center bg-white rounded-xl shadow-2xl p-10 transform transition-all duration-700 scale-100 hover:scale-105">
          <CheckCircle
            size={90}
            className="mx-auto text-green-500 mb-6 animate-bounce"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 text-lg animate-pulse">
            Redirecting you to Track Order...
          </p>
        </div>
      </div>
    );
  }

  // ✅ Payment Form UI
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Secure Checkout
        </h1>

        <form
          onSubmit={handlePayment}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Address */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border rounded-lg p-3"
                  />
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full border rounded-lg p-3"
                  />
                  <input
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="Address Line"
                    className="w-full border rounded-lg p-3"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full border rounded-lg p-3"
                    />
                    <input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      className="w-full border rounded-lg p-3"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Payment Method
                </h2>
                {["cod", "card", "upi", "netbank"].map((method) => (
                  <label key={method} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleChange}
                    />
                    <span className="font-medium capitalize">
                      {method === "cod"
                        ? "Cash on Delivery"
                        : method === "card"
                        ? "Card (Credit/Debit)"
                        : method === "upi"
                        ? "UPI"
                        : "Net Banking"}
                    </span>
                  </label>
                ))}

                {/* Conditionally Render Payment Inputs */}
                <div className="mt-4 space-y-3">
                  {formData.paymentMethod === "card" && (
                    <>
                      <input
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        placeholder="Cardholder Name"
                        className="w-full border rounded-lg p-3"
                      />
                      <input
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="Card Number"
                        className="w-full border rounded-lg p-3"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="Expiry (MM/YY)"
                          className="w-full border rounded-lg p-3"
                        />
                        <input
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="CVV"
                          className="w-full border rounded-lg p-3"
                        />
                      </div>
                    </>
                  )}

                  {formData.paymentMethod === "upi" && (
                    <input
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="Enter your UPI ID"
                      className="w-full border rounded-lg p-3"
                    />
                  )}

                  {formData.paymentMethod === "netbank" && (
                    <>
                      <input
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="Bank Name"
                        className="w-full border rounded-lg p-3"
                      />
                      <input
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="Account Number"
                        className="w-full border rounded-lg p-3"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
                >
                  {processing ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 mb-6 border-b pb-4 max-h-64 overflow-auto">
              {itemsToOrder.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span>
                    {item.name} × {item.quantity || 1}
                  </span>
                  <span>₹{(Number(item.price) || 0) * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{tax}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-yellow-500">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Payment;
