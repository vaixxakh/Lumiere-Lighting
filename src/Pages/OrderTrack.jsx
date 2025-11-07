import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  User,
  ArrowLeft,
  AlertCircle,
  Download
} from "lucide-react";


function OrderTrack() {
  const { orderId } = useParams();
  const { orders } = useCart();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState(0);


  const order = orders.find((o) => o.id === orderId);


  // Status timeline
  const statusTimeline = [
    { status: "Order Placed", icon: Package, color: "text-green-500", bgColor: "bg-green-100", borderColor: "border-green-300" },
    { status: "Processing", icon: Clock, color: "text-blue-500", bgColor: "bg-blue-100", borderColor: "border-blue-300" },
    { status: "Shipped", icon: Truck, color: "text-yellow-500", bgColor: "bg-yellow-100", borderColor: "border-yellow-300" },
    { status: "Delivered", icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-100", borderColor: "border-green-300" },
  ];


  useEffect(() => {
    // Simulate order status progression
    const statuses = ["Order Placed", "Processing", "Shipped", "Delivered"];
    const currentStatus = order?.statusHistory?.[order.statusHistory.length - 1]?.status || "Order Placed";
    const statusIndex = statuses.indexOf(currentStatus);
    setOrderStatus(Math.max(0, statusIndex));
  }, [order]);


  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="text-center bg-white rounded-lg shadow-md p-8 sm:p-12 border border-red-300 max-w-md w-full">
          <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn't find the order you're looking for. Please check the order ID.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition shadow-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }


  const getStatusIcon = (status) => {
    switch (status) {
      case "Order Placed":
        return Package;
      case "Processing":
        return Clock;
      case "Shipped":
        return Truck;
      case "Delivered":
        return CheckCircle;
      default:
        return Package;
    }
  };


  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); }
        }
        @keyframes checkmark {
          0% { transform: scale(0) rotate(-45deg); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1) rotate(0); }
        }
        .animate-fade-up { animation: fadeInUp 0.6s ease-out; }
        .animate-slide-right { animation: slideInRight 0.6s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .animate-checkmark { animation: checkmark 0.5s ease-out; }
      `}</style>


      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold mb-6 transition text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
            📦 Order Tracking
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Track your order status and estimated delivery date
          </p>
        </div>


        {/* Order ID Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Order ID</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                {order.id}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Order Date</p>
              <p className="text-lg sm:text-xl font-bold text-black">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>


        {/* Status Timeline */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-8 border border-gray-200 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-8">Order Status</h2>


          {/* Timeline */}
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-6 left-0 w-full h-1 bg-gray-300 rounded-full">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                style={{ width: `${(orderStatus / 3) * 100}%` }}
              />
            </div>


            {/* Status steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
              {statusTimeline.map((item, index) => {
                const IconComponent = item.icon;
                const isCompleted = index <= orderStatus;
                const isActive = index === orderStatus;


                return (
                  <div key={index} className="text-center animate-slide-right" style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Icon */}
                    <div
                      className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-3 transition-all duration-500 border ${
                        isCompleted ? `${item.bgColor} ${item.borderColor}` : "bg-gray-100 border-gray-300"
                      } ${
                        isActive ? "animate-pulse-glow" : ""
                      }`}
                    >
                      <IconComponent
                        size={24}
                        className={`${
                          isCompleted ? item.color : "text-gray-400"
                        } ${isActive ? "animate-checkmark" : ""}`}
                      />
                    </div>


                    {/* Label */}
                    <p className={`text-xs sm:text-sm font-semibold ${
                      isCompleted ? "text-gray-800" : "text-gray-500"
                    }`}>
                      {item.status}
                    </p>


                    {/* Timestamp */}
                    {order.statusHistory && order.statusHistory[index] && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.statusHistory[index].at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


          {/* Status message */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            <p className="text-sm sm:text-base text-gray-700 text-center">
              {orderStatus === 0 && "✅ Your order has been placed successfully!"}
              {orderStatus === 1 && "⚙️ We're preparing your order for shipment..."}
              {orderStatus === 2 && "🚚 Your package is on its way to you!"}
              {orderStatus === 3 && "🎉 Your order has been delivered! Thank you for your purchase."}
            </p>
          </div>
        </div>


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Items & Shipping (Left) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Section */}
            <div
              className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6 flex items-center gap-2">
                <Package size={22} className="text-yellow-600" />
                Order Items
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-yellow-400 transition"
                  >
                    <div className="flex-1 mb-2 sm:mb-0">
                      <p className="font-semibold text-black text-sm sm:text-base">{item.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Qty: <span className="text-yellow-600">{item.quantity}</span>
                      </p>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-yellow-600">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>


            {/* Shipping Address */}
            <div
              className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6 flex items-center gap-2">
                <MapPin size={22} className="text-blue-600" />
                Delivery Address
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex gap-3">
                  <User size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Name</p>
                    <p className="text-black font-semibold text-sm sm:text-base">
                      {order.shipping?.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-black font-semibold text-sm sm:text-base">
                      {order.shipping?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Address</p>
                    <p className="text-black font-semibold text-sm sm:text-base">
                      {order.shipping?.addressLine}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {order.shipping?.city}, {order.shipping?.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Order Summary (Right) */}
          <div
            className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 h-fit animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">
              💰 Price Details
            </h3>


            <div className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 border-b border-gray-300 mb-4 sm:mb-6">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="text-black font-semibold">
                  ₹{order.totals?.subtotal?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-black font-semibold">
                  ₹{order.totals?.shipping?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                <span>Tax (18%)</span>
                <span className="text-black font-semibold">
                  ₹{order.totals?.tax?.toLocaleString()}
                </span>
              </div>
            </div>


            <div className="mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-bold text-gray-700">
                  Total Amount
                </span>
                <span className="text-2xl sm:text-3xl font-black text-yellow-600">
                  ₹{order.totals?.grandTotal?.toLocaleString()}
                </span>
              </div>
            </div>


            {/* Payment Method */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Payment Method</p>
              <p className="text-sm sm:text-base font-semibold text-black capitalize">
                {order.paymentMethod === "cod"
                  ? "💵 Cash on Delivery"
                  : order.paymentMethod === "card"
                  ? "💳 Credit/Debit Card"
                  : order.paymentMethod === "upi"
                  ? "📱 UPI"
                  : "🏦 Net Banking"}
              </p>
            </div>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 sm:py-4 px-6 rounded-lg transition shadow-md text-sm sm:text-base"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black font-bold py-3 sm:py-4 px-6 rounded-lg transition border border-gray-300 text-sm sm:text-base"
          >
            <Download size={18} />
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}


export default OrderTrack;
