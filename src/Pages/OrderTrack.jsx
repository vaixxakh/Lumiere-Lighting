import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";

function OrderTrack() {
  const { orderId } = useParams();
  const { orders } = useCart(); // Get stored orders from context
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Order Not Found</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-400 px-6 py-2 rounded-lg hover:bg-yellow-500 font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-27">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Tracking</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black-700 mb-2">Order ID:</h2>
          <p className="text-red-600">{order.id}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Status:</h2>
          <p className="text-green-600 font-bold">✅ Order Confirmed & Processing</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-yellow-600 mb-2">Items:</h2>
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between border-b py-2 text-gray-700"
              >
                <span>{item.name}</span>
                <span className="text-red-600">₹{item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Shipping Address:</h2>
          <p className="text-gray-600">{order.shipping.fullName}</p>
          <p className="text-gray-600">{order.shipping.addressLine}</p>
          <p className="text-gray-600">{order.shipping.city}, {order.shipping.zipCode}</p>
          <p className="text-gray-600">📞 {order.shipping.phone}</p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderTrack;
