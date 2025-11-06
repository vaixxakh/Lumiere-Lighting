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
    
    // Auto-refresh every 5 seconds to sync with admin updates
    const interval = setInterval(() => {
      fetchUserOrders();
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchUserOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/login');
        return;
      }

      const res = await axios.get('http://localhost:3000/orders');
      const userOrders = res.data.filter(order => order.email === user.email);
      setOrders(userOrders);
      
      // Update selectedOrder if it exists to show latest status
      if (selectedOrder) {
        const updatedSelected = userOrders.find(o => o.orderId === selectedOrder.orderId);
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
        return <Clock size={20} className="text-yellow-500" />;
      case 'Shipped':
        return <Truck size={20} className="text-blue-500" />;
      case 'Delivered':
        return <CheckCircle size={20} className="text-green-500" />;
      default:
        return <Package size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package className="text-yellow-500 mx-auto" size={48} />
          </div>
          <p className="text-gray-600 font-semibold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="text-4xl mt-15 font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600 mt-2">Total Orders: <span className="font-bold text-yellow-500">{orders.length}</span></p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['all', 'Processing', 'Shipped', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-yellow-500 text-black shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-yellow-400'
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
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg p-6 cursor-pointer transition border-l-4 ${
                    selectedOrder?.orderId === order.orderId
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{order.orderId}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
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

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600"><strong>Items:</strong> {order.items?.length || 0} product(s)</p>
                    <p className="text-lg font-bold text-yellow-600">₹{order.total?.toLocaleString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadInvoice(order);
                      }}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
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
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>

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
                    </p>
                  </div>

                  {/* Customer Info */}
                  <div className="border-b pb-4 mb-4">
                    <h3 className="font-bold text-gray-800 mb-2">Delivery Address</h3>
                    <div className="flex gap-2 text-sm text-gray-700">
                      <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                      <p>{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border-b pb-4 mb-4">
                    <h3 className="font-bold text-gray-800 mb-3">Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.productName}</span>
                          <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping</span>
                        <span>₹{selectedOrder.shipping?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Tax</span>
                        <span>₹{selectedOrder.tax?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="border-t-2 border-yellow-200 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-yellow-600">₹{selectedOrder.total?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Download Invoice */}
                  <button
                    onClick={() => downloadInvoice(selectedOrder)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download Invoice
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center sticky top-6">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 font-semibold">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition"
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
