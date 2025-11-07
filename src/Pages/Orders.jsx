import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, MapPin, Calendar, DollarSign, Truck, CheckCircle, Clock, Download, Eye, ArrowLeft } from 'lucide-react';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUserOrders();
    
    const interval = setInterval(() => {
      fetchUserOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // src/pages/Orders.jsx - Update the fetch function
const fetchUserOrders = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    // ✅ TRY BACKEND FIRST
    try {
      const res = await axios.get('http://localhost:3000/orders');
      let userOrders = res.data.filter(order => order.email === user.email);
      
      // ✅ MERGE WITH LOCAL ORDERS IF EMPTY
      if (userOrders.length === 0) {
        userOrders = orders.filter(order => order.email === user.email);
      }
      
      setOrders(userOrders);
    } catch (backendError) {
      // ✅ FALLBACK TO LOCAL STORAGE
      console.log("Using local orders...");
      const localOrders = orders.filter(order => order.email === user.email);
      setOrders(localOrders);
    }

    if (selectedOrder) {
      const updatedSelected = orders.find(o => o.orderId === selectedOrder.orderId || o.id === selectedOrder.id);
      if (updatedSelected) {
        setSelectedOrder(updatedSelected);
      }
    }

    setLoading(false);
  } catch (error) {
    console.error('Error fetching orders:', error);
    setLoading(false);
  }
};


  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <Clock size={20} className="text-yellow-400" />;
      case 'Shipped':
        return <Truck size={20} className="text-blue-400" />;
      case 'Delivered':
        return <CheckCircle size={20} className="text-green-400" />;
      default:
        return <Package size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'Shipped':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'Delivered':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const downloadInvoice = (order) => {
    const invoiceContent = `
╔═══════════════════════════════════════════════════════════╗
║                    LUMIERE INVOICE                        ║
╚═══════════════════════════════════════════════════════════╝

ORDER DETAILS
─────────────────────────────────────────────────────────────
Order ID:        ${order.orderId}
Order Date:      ${new Date(order.orderDate).toLocaleDateString()}
Status:          ${order.status}
Payment Method:  ${order.paymentMethod}

CUSTOMER INFORMATION
─────────────────────────────────────────────────────────────
Name:            ${order.customerName}
Email:           ${order.email}
Phone:           ${order.phone || 'N/A'}

SHIPPING ADDRESS
─────────────────────────────────────────────────────────────
${order.shippingAddress}

ORDER ITEMS
─────────────────────────────────────────────────────────────
${order.items?.map(item => 
  `${item.productName}
  Quantity: ${item.quantity} x Price: ₹${item.price}
  Subtotal: ₹${(item.price * item.quantity).toLocaleString()}\n`
).join('\n')}

PRICE SUMMARY
─────────────────────────────────────────────────────────────
Subtotal:        ₹${order.subtotal?.toLocaleString() || 0}
Shipping:        ₹${order.shipping?.toLocaleString() || 0}
Tax (18%):       ₹${order.tax?.toLocaleString() || 0}
─────────────────────────────────────────────────────────────
TOTAL:           ₹${order.total?.toLocaleString() || 0}

Thank you for shopping with Lumiere! ✨

For support, contact: support@lumiere.com
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package className="text-yellow-400 mx-auto" size={48} />
          </div>
          <p className="text-gray-300 font-semibold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 sm:py-24 md:py-35 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold mb-6 transition"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
            My Orders
          </h1>
          <p className="text-gray-400">
            Total Orders: <span className="font-bold text-yellow-400">{orders.length}</span>
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
          {['all', 'Processing', 'Shipped', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition text-sm sm:text-base ${
                filter === status
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-yellow-500/50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Display */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order.orderId}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 p-6 cursor-pointer transition border-l-4 hover:scale-102 ${
                    selectedOrder?.orderId === order.orderId
                      ? 'border-yellow-400 bg-gradient-to-br from-gray-750 to-gray-850 shadow-yellow-500/30'
                      : 'border-gray-700 hover:border-yellow-400/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{order.orderId}</h3>
                      <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={14} />
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 border-b border-gray-700 pb-4">
                    <p className="text-sm text-gray-400"><strong>Items:</strong> {order.items?.length || 0} product(s)</p>
                    <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                      ₹{order.total?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 border border-blue-500/30"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadInvoice(order);
                      }}
                      className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 border border-green-500/30"
                    >
                      <Download size={16} />
                      Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Details Sidebar */}
            <div>
              {selectedOrder ? (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 sticky top-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>

                  {/* Status */}
                  <div className={`p-4 rounded-lg mb-4 ${getStatusColor(selectedOrder.status)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="font-semibold">{selectedOrder.status}</span>
                    </div>
                    <p className="text-sm opacity-80">
                      {selectedOrder.status === 'Processing' && 'Your order is being prepared'}
                      {selectedOrder.status === 'Shipped' && 'Your order is on the way'}
                      {selectedOrder.status === 'Delivered' && 'Order delivered successfully'}
                      {selectedOrder.status === 'Pending' && 'Your order is awaiting confirmation'}
                    </p>
                  </div>

                  {/* Customer Info */}
                  <div className="border-b border-gray-700 pb-4 mb-4">
                    <h3 className="font-bold text-white mb-2">Delivery Address</h3>
                    <div className="flex gap-2 text-sm text-gray-400">
                      <MapPin size={16} className="flex-shrink-0 mt-0.5 text-yellow-400" />
                      <p>{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border-b border-gray-700 pb-4 mb-4">
                    <h3 className="font-bold text-white mb-3">Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-400">{item.productName}</span>
                          <span className="font-bold text-gray-300">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 p-4 rounded-lg mb-4 border border-yellow-500/20">
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Shipping</span>
                        <span>₹{selectedOrder.shipping?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Tax (18%)</span>
                        <span>₹{selectedOrder.tax?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="border-t border-yellow-500/30 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-300">Total</span>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                        ₹{selectedOrder.total?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Download Invoice */}
                  <button
                    onClick={() => downloadInvoice(selectedOrder)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/50"
                  >
                    <Download size={18} />
                    Download Invoice
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 text-center sticky top-6 border border-gray-700">
                  <Package size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 font-semibold">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-12 text-center border border-gray-700">
            <Package size={48} className="mx-auto text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Found</h2>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-8 rounded-lg transition shadow-lg hover:shadow-yellow-500/50"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
