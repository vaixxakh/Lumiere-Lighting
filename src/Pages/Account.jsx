import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, Save, X, ArrowLeft, Shield, Calendar, LogOut, Package } from 'lucide-react';


const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(storedUser);
    setEditData(storedUser);
    setLoading(false);
  }, [navigate]);


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };


  const handleSaveChanges = () => {
    setErrorMsg('');
    
    if (!editData.name?.trim()) {
      setErrorMsg('Name is required');
      return;
    }
    if (!editData.email?.trim()) {
      setErrorMsg('Email is required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(editData.email)) {
      setErrorMsg('Invalid email format');
      return;
    }
    if (editData.phone?.trim()) {
      const phoneDigits = editData.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        setErrorMsg('Phone number must be 10 digits');
        return;
      }
    }


    const updatedUser = { ...user, ...editData, updatedAt: new Date().toISOString() };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };


  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };


  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
    setErrorMsg('');
  };


  const handleDeleteAccount = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    navigate('/login');
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <User className="text-yellow-600 mx-auto" size={48} />
          </div>
          <p className="text-gray-700 font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }


  if (!user) {
    return null;
  }


  return (
    <div className="min-h-screen bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold mb-6 transition text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
            👤 My Account
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your profile and settings</p>
        </div>


        {/* Success Message */}
        {successMsg && (
          <div className="bg-green-100 border border-green-300 p-4 rounded-lg flex items-center gap-3 mb-6 animate-pulse">
            <Shield className="text-green-600 flex-shrink-0" size={20} />
            <p className="text-green-700 text-sm sm:text-base">{successMsg}</p>
          </div>
        )}


        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-300 p-4 rounded-lg flex items-center gap-3 mb-6">
            <X className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm sm:text-base">{errorMsg}</p>
          </div>
        )}


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200 sticky top-6">
              {/* Profile Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="text-white" size={48} />
                </div>
              </div>


              {/* User Name */}
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-1">{user.name}</h2>
                <p className="text-xs sm:text-sm text-yellow-600 font-semibold">Premium Member</p>
              </div>


              {/* Member Since */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <Calendar size={16} className="text-yellow-600" />
                  <p className="text-xs sm:text-sm">Member Since</p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-black">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>


              {/* Account Status */}
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="text-green-600" size={18} />
                  <div>
                    <p className="text-xs text-gray-600">Account Status</p>
                    <p className="text-sm font-bold text-green-600">✓ Active</p>
                  </div>
                </div>
              </div>


              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-100 hover:bg-red-200 text-red-600 border border-red-300 font-bold py-2.5 sm:py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>


          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="text-xl sm:text-2xl font-bold text-black flex items-center gap-2">
                  <User size={24} className="text-yellow-600" />
                  Personal Information
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 border border-yellow-300 px-3 sm:px-4 py-2 rounded-lg transition text-sm font-semibold"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                )}
              </div>


              {isEditing ? (
                <div className="space-y-4 sm:space-y-5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-black placeholder-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                      placeholder="Enter your full name"
                    />
                  </div>


                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-black placeholder-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                      placeholder="Enter your email"
                    />
                  </div>


                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-black placeholder-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                      placeholder="Enter your phone number"
                    />
                  </div>


                  {/* City Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={editData.city || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-black placeholder-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                      placeholder="Enter your city"
                    />
                  </div>


                  {/* Address Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={editData.address || ''}
                      onChange={handleEditChange}
                      rows={3}
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-black placeholder-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 transition resize-none"
                      placeholder="Enter your address"
                    />
                  </div>


                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveChanges}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5">
                  {/* Display Mode */}
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <User className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Full Name</p>
                      <p className="text-sm sm:text-base font-semibold text-black break-words">{user.name || 'N/A'}</p>
                    </div>
                  </div>


                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Mail className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Email Address</p>
                      <p className="text-sm sm:text-base font-semibold text-black break-all">{user.email || 'N/A'}</p>
                    </div>
                  </div>


                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Phone className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Phone Number</p>
                      <p className="text-sm sm:text-base font-semibold text-black">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>


                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">City</p>
                      <p className="text-sm sm:text-base font-semibold text-black">{user.city || 'Not provided'}</p>
                    </div>
                  </div>


                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Address</p>
                      <p className="text-sm sm:text-base font-semibold text-black break-words">{user.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Account Activity */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-black mb-6 flex items-center gap-2">
                <Package size={24} className="text-yellow-600" />
                Account Activity
              </h3>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Account Created */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Account Created</p>
                  <p className="text-sm sm:text-base font-bold text-black">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN')}
                  </p>
                </div>


                {/* Last Updated */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                  <p className="text-sm sm:text-base font-bold text-black">
                    {new Date(user.updatedAt || user.createdAt || Date.now()).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            </div>


            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-black mb-6">Quick Actions</h3>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => navigate('/orders')}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300 font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Package size={18} />
                  My Orders
                </button>


                <button
                  onClick={() => navigate('/wishlist')}
                  className="bg-red-100 hover:bg-red-200 text-red-600 border border-red-300 font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  ❤️ Wishlist
                </button>


                <button
                  onClick={() => navigate('/products')}
                  className="bg-green-100 hover:bg-green-200 text-green-600 border border-green-300 font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  🛍️ Continue Shopping
                </button>


                <button
                  onClick={() => navigate('/cart')}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-600 border border-yellow-300 font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  🛒 My Cart
                </button>
              </div>
            </div>


            {/* Danger Zone */}
            <div className="bg-red-50 rounded-lg shadow-md p-6 sm:p-8 border border-red-300">
              <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">Account deletion is permanent and cannot be undone.</p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-600 border border-red-300 font-bold py-3 rounded-lg transition text-sm sm:text-base"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-600 text-sm font-semibold">Are you sure? This cannot be undone!</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Account;
