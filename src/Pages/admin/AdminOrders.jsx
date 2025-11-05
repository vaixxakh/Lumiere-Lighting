import React, { useEffect, useState } from 'react';
import { getOrders, updateOrder } from '../Services/adminApi';
import { ShoppingBag, MapPin, Mail, User, Truck, CheckCircle, Clock, AlertCircle, Eye, DownloadCloud, X } from 'lucide-react';

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

  const changeStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    setError('');
    setSuccessMsg('');
    
    try {
      await updateOrder(orderId, { status });
      
      // Update local state immediately
      const updatedOrders = orders.map(order => 
        order.orderId === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);
      
      // Update selected order
      if (selected && selected.orderId === orderId) {
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

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.email.toLowerCase().includes(searchTerm.toLowerCase());
    
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
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Delivered':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
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
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const downloadInvoice = (order) => {
    // Create a simple invoice
    const invoiceContent = `
LUMIERE - ORDER INVOICE
========================

Order ID: ${order.orderId}
Date: ${new Date(order.orderDate).toLocaleDateString()}
Status: ${order.status}

CUSTOMER DETAILS:
Name: ${order.customerName}
Email: ${order.email}
Address: ${order.shippingAddress}

ITEMS:
${order.items?.map(item => `${item.productName} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`).join('\n')}

SUMMARY:
Subtotal: ₹${order.subtotal?.toLocaleString()}
Shipping: ₹${order.shipping?.toLocaleString()}
Tax: ₹${order.tax?.toLocaleString()}
---
TOTAL: ₹${order.total?.toLocaleString()}

Thank you for your purchase!
    `;

    // Create blob and download
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
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <div className="text-yellow-500 text-6xl">⊙</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-600 mt-1">Total Orders: <span className="font-bold text-yellow-500">{orders.length}</span></p>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 flex items-start gap-3 rounded-lg animate-pulse">
          <CheckCircle className="text-green-500 mt-0.5" size={20} />
          <p className="text-green-700">{successMsg}</p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3 rounded-lg">
          <AlertCircle className="text-red-500 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-gray-100 text-sm font-semibold mb-2">Pending</p>
          <p className="text-4xl font-bold">{orders.filter(o => o.status === 'Pending').length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-yellow-100 text-sm font-semibold mb-2">Processing</p>
          <p className="text-4xl font-bold">{orders.filter(o => o.status === 'Processing').length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-blue-100 text-sm font-semibold mb-2">Shipped</p>
          <p className="text-4xl font-bold">{orders.filter(o => o.status === 'Shipped').length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-green-100 text-sm font-semibold mb-2">Delivered</p>
          <p className="text-4xl font-bold">{orders.filter(o => o.status === 'Delivered').length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition"
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 flex items-center gap-3">
            <ShoppingBag size={28} />
            <div>
              <h2 className="text-2xl font-bold">All Orders</h2>
              <p className="text-purple-100 text-sm">{filteredOrders.length} order(s)</p>
            </div>
          </div>

          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(o => (
                <div
                  key={o.orderId}
                  onClick={() => setSelected(o)}
                  className={`p-4 rounded-lg cursor-pointer transition border-2 ${
                    selected?.orderId === o.orderId
                      ? 'bg-yellow-50 border-yellow-400 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-yellow-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{o.customerName}</p>
                      <p className="text-sm text-gray-600 mt-1">{o.orderId}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Mail size={12} />
                        {o.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-500 font-bold text-lg">₹{o.total}</p>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mt-2 border ${getStatusColor(o.status)}`}>
                        {getStatusIcon(o.status)}
                        {o.status}
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
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
              {/* Header */}
              <div className={`bg-gradient-to-r ${getStatusBgGradient(selected.status)} text-white p-6`}>
                <div className="flex items-center gap-2 mb-3">
                  {getStatusIcon(selected.status)}
                  <span className="text-sm font-semibold uppercase opacity-90">{selected.status}</span>
                </div>
                <h3 className="text-2xl font-bold">{selected.orderId}</h3>
                <p className="text-sm opacity-90 mt-1">{new Date(selected.orderDate).toLocaleDateString()}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Customer Info */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-3">Customer Details</label>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold">{selected.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold break-all text-sm">{selected.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold text-sm">{selected.shippingAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-3">Items</label>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {selected.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm border-b pb-2 last:border-b-0">
                        <span className="text-gray-800">{item.productName} x{item.quantity}</span>
                        <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>₹{selected.subtotal?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span>₹{selected.shipping?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax</span>
                      <span>₹{selected.tax?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="border-t-2 border-yellow-300 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-yellow-600">₹{selected.total?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Status Update Buttons */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-3">Update Status</label>
                  <div className="space-y-2">
                    {['Processing', 'Shipped', 'Delivered'].map(s => (
                      <button
                        key={s}
                        onClick={() => changeStatus(selected.orderId, s)}
                        disabled={updatingId === selected.orderId}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                          selected.status === s
                            ? `bg-gradient-to-r ${getStatusBgGradient(s)} text-white shadow-lg`
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {updatingId === selected.orderId && selected.status !== s ? (
                          <>
                            <span className="animate-spin inline-block mr-2">⊙</span>
                            Updating...
                          </>
                        ) : (
                          <>
                            {s === selected.status ? '✓ ' : ''}{s}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => setShowViewModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg font-semibold transition"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => downloadInvoice(selected)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg font-semibold transition"
                  >
                    <DownloadCloud size={16} />
                    Invoice
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center sticky top-6">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-semibold">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className={`bg-gradient-to-r ${getStatusBgGradient(selected.status)} text-white p-6 flex justify-between items-center sticky top-0`}>
              <h2 className="text-2xl font-bold">{selected.orderId}</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-bold">{selected.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-bold text-yellow-600">{selected.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-sm">{selected.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-bold">{new Date(selected.orderDate).toLocaleDateString()}</p>
                </div>
              </div>

              <hr />

              <div>
                <h3 className="font-bold text-lg mb-2">Shipping Address</h3>
                <p className="text-gray-700">{selected.shippingAddress}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selected.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{item.productName} x{item.quantity}</span>
                      <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              <div className="bg-yellow-50 p-4 rounded">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{selected.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span>₹{selected.shipping?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-3 pb-3 border-b-2">
                  <span>Tax:</span>
                  <span>₹{selected.tax?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-yellow-600">₹{selected.total?.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setShowViewModal(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
