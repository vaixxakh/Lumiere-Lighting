import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function Payment() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
  });

  // ✅ Calculate totals safely
  const total = (cart || []).reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const finalTotal = total + 100 + Math.round(total * 0.18);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validation
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert('Please enter your full name.');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      alert('Please enter a valid 10-digit phone number.');
      return false;
    }
    if (!formData.addressLine.trim() || formData.addressLine.length < 5) {
      alert('Please enter your address.');
      return false;
    }
    if (!formData.city.trim()) {
      alert('Please enter your city.');
      return false;
    }
    if (!/^\d{5,6}$/.test(formData.zipCode.trim())) {
      alert('Please enter a valid ZIP/Postal Code.');
      return false;
    }

    const method = formData.paymentMethod;
    if (method === 'card') {
      if (!formData.cardName.trim()) return alert('Please enter cardholder name.'), false;
      if (!/^\d{13,16}$/.test(formData.cardNumber.replace(/\s+/g, '')))
        return alert('Please enter a valid card number (13–16 digits).'), false;
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate))
        return alert('Please enter expiry date as MM/YY.'), false;
      if (!/^\d{3,4}$/.test(formData.cvv))
        return alert('Please enter a valid CVV (3 or 4 digits).'), false;
    } else if (method === 'upi') {
      if (!/^[\w.\-]{3,}@[a-zA-Z]{3,}$/.test(formData.upiId.trim()))
        return alert('Please enter a valid UPI ID (example: name@bank).'), false;
    } else if (method === 'netbank') {
      if (!formData.bankName.trim()) return alert('Please enter bank name.'), false;
      if (!/^\d{6,20}$/.test(formData.accountNumber.replace(/\s+/g, '')))
        return alert('Please enter a valid account number.'), false;
    }

    return true;
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    setTimeout(() => {
      setOrderPlaced(true);

      (cart || []).forEach((item) => {
        try {
          removeFromCart(item.id);
        } catch (err) {}
      });

      setProcessing(false);

      setTimeout(() => {
        navigate('/');
        alert('Order placed successfully! Thank you for shopping at Lumiere.');
      }, 2500);
    }, 1500);
  };

  // 🛒 Empty cart UI
  if ((cart || []).length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/collections')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ✅ Order placed success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center bg-white rounded-lg shadow-2xl p-8">
          <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">Thank you for shopping at Lumiere Luxury Lights</p>
          <p className="text-2xl font-bold text-yellow-500 mb-6">Total: ₹{finalTotal}</p>
          <p className="text-gray-600">You will be redirected to home page...</p>
        </div>
      </div>
    );
  }

  // ✅ Payment Form
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Secure Checkout</h1>

        <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section: Address + Payment */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Address Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400"
                  />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400"
                  />
                  <input
                    type="text"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="Address Line (House no, Street)"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h2>

                <div className="space-y-3">
                  {['cod', 'card', 'upi', 'netbank'].map((method) => (
                    <label key={method} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        className="form-radio"
                      />
                      <span className="font-medium capitalize">
                        {method === 'cod'
                          ? 'Cash on Delivery (COD)'
                          : method === 'card'
                          ? 'Card (Credit/Debit)'
                          : method === 'upi'
                          ? 'UPI'
                          : 'Net Banking'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional Inputs for Payment */}
              {formData.paymentMethod === 'card' && (
                <div className="space-y-4 border-t pt-6">
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="Cardholder Name"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="Card Number"
                    maxLength="19"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full border border-gray-300 rounded-lg p-3"
                    />
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="CVV"
                      maxLength="4"
                      className="w-full border border-gray-300 rounded-lg p-3"
                    />
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'upi' && (
                <div className="space-y-4 border-t pt-6">
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="example@bank"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>
              )}

              {formData.paymentMethod === 'netbank' && (
                <div className="space-y-4 border-t pt-6">
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Bank Name"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Account Number"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
                >
                  {processing ? 'Processing...' : 'Complete Payment'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6 border-b pb-4 max-h-64 overflow-auto">
              {(cart || []).map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span>
                    {item.name} x{item.quantity || 1}
                  </span>
                  <span>₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹100</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{Math.round(total * 0.18)}</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-yellow-500">₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Payment;
