import React, { useEffect, useState } from 'react';
import { getOrders, updateOrder } from '../Services/adminApi';
import { ShoppingBag, MapPin, Mail, User, Truck, CheckCircle, Clock, AlertCircle, Eye, DownloadCloud, X, Phone } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error loading orders');
      setLoading(false);
    }
  };

  // ✅ FIX: Format price properly
  const formatPrice = (price) => {
    if (!price && price !== 0) return '0';
    return Number(price).toLocaleString('en-IN');
  };

  // ✅ FIX: Safe string conversion for toLowerCase
  const safeString = (str) => {
    return str ? String(str).toLowerCase() : '';
  };

  // PATCH the whole order object to work with JSON Server
  const changeStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    setError('');
    setSuccessMsg('');

    try {
      // ✅ FIX: Look for both orderId and id
      const order = orders.find((o) => o.orderId === orderId || o.id === orderId);
      if (!order) throw new Error('Order not found');
      
      // ✅ FIX: Use correct ID field for database
      const dbId = order.id || order.orderId;
      await updateOrder(dbId, { ...order, status });
      
      const updatedOrders = orders.map(o =>
        (o.orderId === orderId || o.id === orderId) ? { ...o, status } : o
      );
      setOrders(updatedOrders);

      if (selected && (selected.orderId === orderId || selected.id === orderId)) {
        setSelected(prev => prev ? { ...prev, status } : null);
      }

      setSuccessMsg(`Order status updated to ${status}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ FIX: Safe filter with null checks
  const filteredOrders = orders.filter(o => {
    if (!o) return false;
    
    const matchesSearch = 
      safeString(o.customerName).includes(safeString(searchTerm)) ||
      safeString(o.orderId).includes(safeString(searchTerm)) ||
      safeString(o.email).includes(safeString(searchTerm));
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && o.status === filterStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <Clock size={16} />;
      case 'Shipped':
        return <Truck size={16} />;
      case 'Delivered':
        return <CheckCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
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
      case 'Pending':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const getStatusBgGradient = (status) => {
    switch (status) {
      case 'Processing':
        return 'from-yellow-500 to-yellow-600';
      case 'Shipped':
        return 'from-blue-500 to-blue-600';
      case 'Delivered':
        return 'from-green-500 to-green-600';
      case 'Pending':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const downloadInvoice = (order) => {
    const invoiceContent = `
╔═══════════════════════════════════════════════════════════╗
║                    LUMIERE - INVOICE                      ║
╚═══════════════════════════════════════════════════════════╝

ORDER DETAILS
─────────────────────────────────────────────────────────────
Order ID:        ${order.orderId}
Date:            ${new Date(order.orderDate || new Date()).toLocaleDateString()}
Status:          ${order.status || 'N/A'}
Payment Method:  ${order.paymentMethod || 'N/A'}

CUSTOMER DETAILS:
Name:            ${order.customerName || 'N/A'}
Email:           ${order.email || 'N/A'}
Phone:           ${order.phone || 'N/A'}
Address:         ${order.shippingAddress || 'N/A'}

ORDER ITEMS:
─────────────────────────────────────────────────────────────
${order.items?.map(item => `${item.productName}
  Quantity: ${item.quantity} x Price: ₹${formatPrice(item.price)}
  Subtotal: ₹${formatPrice(item.price * item.quantity)}`).join('\n\n') || 'No items'}

PRICE SUMMARY
─────────────────────────────────────────────────────────────
Subtotal:        ₹${formatPrice(order.subtotal)}
Shipping:        ₹${formatPrice(order.shipping)}
Tax (18%):       ₹${formatPrice(order.tax)}
─────────────────────────────────────────────────────────────
TOTAL:           ₹${formatPrice(order.total)}

Thank you for your business! ✨
    `;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    setSuccessMsg('Invoice downloaded successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <ShoppingBag className="text-yellow-400 mx-auto" size={48} />
          </div>
          <p className="text-gray-300 font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              📦 Order Management
            </h1>
            <p className="text-gray-400 mt-2">
              Total Orders: <span className="font-bold text-yellow-400">{orders.length}</span>
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-lg flex items-start gap-3 animate-pulse">
            <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-green-300">{successMsg}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Pending', status: 'Pending', from: 'from-gray-500', to: 'to-gray-600' },
            { label: 'Processing', status: 'Processing', from: 'from-yellow-500', to: 'to-yellow-600' },
            { label: 'Shipped', status: 'Shipped', from: 'from-blue-500', to: 'to-blue-600' },
            { label: 'Delivered', status: 'Delivered', from: 'from-green-500', to: 'to-green-600' },
          ].map(item => (
            <div key={item.status} className={`bg-gradient-to-br ${item.from} ${item.to} text-white rounded-lg shadow-lg p-4 sm:p-6`}>
              <p className="text-sm font-semibold mb-2 opacity-90">{item.label}</p>
              <p className="text-3xl sm:text-4xl font-bold">{orders.filter(o => o?.status === item.status).length}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-yellow-400 transition"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-yellow-400 transition"
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 flex items-center gap-3">
              <ShoppingBag size={28} />
              <div>
                <h2 className="text-2xl font-bold">All Orders</h2>
                <p className="text-purple-100 text-sm">{filteredOrders.length} order(s)</p>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3 max-h-96 overflow-y-auto">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(o => (
                  <div
                    key={o.orderId || o.id}
                    onClick={() => setSelected(o)}
                    className={`p-4 rounded-lg cursor-pointer transition border-2 ${
                      (selected?.orderId === o.orderId || selected?.id === o.id)
                        ? 'bg-yellow-500/10 border-yellow-400 shadow-lg'
                        : 'bg-gray-700/50 border-gray-600 hover:border-yellow-400/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-white">{o.customerName || 'Unknown'}</p>
                        <p className="text-sm text-gray-400 mt-1">{o.orderId || o.id}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Mail size={12} />
                          {o.email || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold text-lg">₹{formatPrice(o.total)}</p>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mt-2 border ${getStatusColor(o.status || 'Pending')}`}>
                          {getStatusIcon(o.status || 'Pending')}
                          {o.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag size={40} className="mx-auto mb-2 opacity-50" />
                  <p className="text-lg font-semibold">No orders found</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div>
            {selected ? (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden sticky top-6 border border-gray-700">
                <div className={`bg-gradient-to-r ${getStatusBgGradient(selected.status || 'Pending')} text-white p-6`}>
                  <div className="flex items-center gap-2 mb-3">
                    {getStatusIcon(selected.status || 'Pending')}
                    <span className="text-sm font-semibold uppercase opacity-90">{selected.status || 'Pending'}</span>
                  </div>
                  <h3 className="text-2xl font-bold">{selected.orderId || selected.id}</h3>
                  <p className="text-sm opacity-90 mt-1">
                    {new Date(selected.orderDate || new Date()).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {/* Customer Details */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase block mb-3">Customer Details</label>
                    <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <User size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">Name</p>
                          <p className="font-semibold text-white break-words">{selected.customerName || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="font-semibold text-white text-sm break-all">{selected.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">Phone</p>
                          <p className="font-semibold text-white">{selected.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">Address</p>
                          <p className="font-semibold text-white text-sm break-words">{selected.shippingAddress || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase block mb-3">Items</label>
                    <div className="bg-gray-700/50 rounded-lg p-4 space-y-2 max-h-32 overflow-y-auto">
                      {selected.items && selected.items.length > 0 ? (
                        selected.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm border-b border-gray-600 pb-2 last:border-b-0 text-gray-300">
                            <span>{item.productName || 'Product'} x{item.quantity || 1}</span>
                            <span className="font-semibold">₹{formatPrice(item.price * (item.quantity || 1))}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No items</p>
                      )}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>₹{formatPrice(selected.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Shipping</span>
                        <span>₹{formatPrice(selected.shipping)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Tax</span>
                        <span>₹{formatPrice(selected.tax)}</span>
                      </div>
                    </div>
                    <div className="border-t border-yellow-500/30 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-300">Total</span>
                      <span className="text-2xl font-bold text-yellow-400">₹{formatPrice(selected.total)}</span>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase block mb-3">Update Status</label>
                    <div className="space-y-2">
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].map(s => (
                        <button
                          key={s}
                          onClick={() => changeStatus(selected.orderId || selected.id, s)}
                          disabled={updatingId === (selected.orderId || selected.id)}
                          className={`w-full py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
                            selected.status === s
                              ? `bg-gradient-to-r ${getStatusBgGradient(s)} text-white shadow-lg`
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {updatingId === (selected.orderId || selected.id) ? '⏳ Updating...' : `${s === selected.status ? '✓ ' : ''}${s}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-600">
                    <button
                      onClick={() => setShowViewModal(true)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-lg font-semibold transition text-sm"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => downloadInvoice(selected)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 rounded-lg font-semibold transition text-sm"
                    >
                      <DownloadCloud size={16} />
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 text-center sticky top-6 border border-gray-700">
                <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 font-semibold">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showViewModal && selected && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto border border-gray-700">
              <div className={`bg-gradient-to-r ${getStatusBgGradient(selected.status || 'Pending')} text-white p-6 flex justify-between items-center sticky top-0 z-10`}>
                <h2 className="text-2xl font-bold">{selected.orderId || selected.id}</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Customer</p>
                    <p className="font-bold text-white">{selected.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <p className="font-bold text-yellow-400">{selected.status || 'Pending'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-semibold text-gray-300 text-sm break-all">{selected.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Order Date</p>
                    <p className="font-bold text-white">{new Date(selected.orderDate || new Date()).toLocaleDateString()}</p>
                  </div>
                </div>
                <hr className="border-gray-600" />
                <div>
                  <h3 className="font-bold text-lg text-white mb-2">Shipping Address</h3>
                  <p className="text-gray-300">{selected.shippingAddress || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selected.items && selected.items.length > 0 ? (
                      selected.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-gray-700/50 rounded text-gray-300">
                          <span>{item.productName || 'Product'} x{item.quantity || 1}</span>
                          <span className="font-bold">₹{formatPrice(item.price * (item.quantity || 1))}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No items</p>
                    )}
                  </div>
                </div>
                <hr className="border-gray-600" />
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded">
                  <div className="flex justify-between mb-2 text-gray-300">
                    <span>Subtotal:</span>
                    <span>₹{formatPrice(selected.subtotal)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-gray-300">
                    <span>Shipping:</span>
                    <span>₹{formatPrice(selected.shipping)}</span>
                  </div>
                  <div className="flex justify-between mb-3 pb-3 border-b border-yellow-500/30 text-gray-300">
                    <span>Tax:</span>
                    <span>₹{formatPrice(selected.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total:</span>
                    <span className="text-yellow-400">₹{formatPrice(selected.total)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
