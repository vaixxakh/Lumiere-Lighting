import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../Services/adminApi';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <div className="text-yellow-500 text-6xl">⊙</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-xl">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-xl text-red-600 font-semibold">Error loading dashboard</p>
        </div>
      </div>
    );
  }

  // Stat Card Component
  const StatCard = ({ icon: Icon, title, value, color, bgGradient }) => (
    <div className={`${bgGradient} text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={36} className="opacity-80" />
        <span className="text-xs font-semibold uppercase opacity-70 bg-white bg-opacity-20 px-3 py-1 rounded-full">
          Total
        </span>
      </div>
      <p className="text-4xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-90">{title}</p>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Welcome back!</p>
          <p className="text-2xl font-bold text-yellow-600">Admin</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          title="Products"
          value={stats.totalProducts}
          color="blue"
          bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={ShoppingBag}
          title="Orders"
          value={stats.totalOrders}
          color="green"
          bgGradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          icon={Users}
          title="Users"
          value={stats.totalUsers}
          color="purple"
          bgGradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          icon={DollarSign}
          title="Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          color="yellow"
          bgGradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
      </div>

      {/* Order Status Summary */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp size={28} className="text-yellow-500" />
          Order Status Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
            <p className="text-yellow-600 font-semibold text-sm mb-2">Pending Orders</p>
            <p className="text-4xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <p className="text-blue-600 font-semibold text-sm mb-2">Processing</p>
            <p className="text-4xl font-bold text-blue-600">{stats.processingOrders}</p>
          </div>
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6">
            <p className="text-orange-600 font-semibold text-sm mb-2">Shipped</p>
            <p className="text-4xl font-bold text-orange-600">{stats.shippedOrders}</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
            <p className="text-green-600 font-semibold text-sm mb-2">Delivered</p>
            <p className="text-4xl font-bold text-green-600">{stats.deliveredOrders}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag size={28} />
              Recent Orders
            </h2>
          </div>
          <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map(order => (
                <div
                  key={order.orderId}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition border-l-4 border-green-500"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{order.customerName}</p>
                    <p className="text-xs text-gray-600 mt-1">{order.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-500 text-lg">₹{order.total}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold inline-block mt-1 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users size={28} />
              Recent Users
            </h2>
          </div>
          <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
            {stats.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition border-l-4 border-blue-500"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-green-600 font-semibold text-xs bg-green-100 px-3 py-1 rounded-full">
                    <CheckCircle size={14} />
                    Active
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users size={32} className="mx-auto mb-2 opacity-50" />
                <p>No users yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6"> Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm font-semibold">Avg Order Value</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-semibold">Conversion Rate</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {stats.totalUsers > 0 ? Math.round((stats.totalOrders / stats.totalUsers) * 100) : 0}%
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-semibold">Fulfillment Rate</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
