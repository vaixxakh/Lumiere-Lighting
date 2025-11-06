import React, { useEffect, useState } from 'react';
import { getUsers, blockUser, unblockUser } from "../Services/adminApi";
import { Ban, Check, Mail, User, Search, Filter, MoreVertical } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, blocked
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleBlock = async (id) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        await blockUser(id);
        fetchUsers();
        setShowDetails(false);
      } catch (error) {
        alert('Error blocking user');
      }
    }
  };

  const handleUnblock = async (id) => {
    if (window.confirm('Are you sure you want to unblock this user?')) {
      try {
        await unblockUser(id);
        fetchUsers();
        setShowDetails(false);
      } catch (error) {
        alert('Error unblocking user');
      }
    }
  };

  // Safe filtering with empty string fallback
  const filteredUsers = users.filter(u => {
    const name = u.name ? u.name.toLowerCase() : '';
    const email = u.email ? u.email.toLowerCase() : '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = name.includes(search) || email.includes(search);

    if (filter === 'active') return matchesSearch && !u.blocked;
    if (filter === 'blocked') return matchesSearch && u.blocked;
    return matchesSearch;
  });

  // Fix: clear selected user if not in filtered list
  useEffect(() => {
    if (selectedUser && !filteredUsers.some(u => u.id === selectedUser.id)) {
      setSelectedUser(null);
      setShowDetails(false);
    }
  }, [searchTerm, filter, users]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <div className="text-yellow-500 text-4xl">⊙</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Total Users: <span className="font-bold text-yellow-500">{users.length}</span></p>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm">Total Users</p>
              <p className="text-3xl sm:text-4xl font-bold">{users.length}</p>
            </div>
            <User size={24} className="opacity-20 sm:w-8 sm:h-8" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm">Active Users</p>
              <p className="text-3xl sm:text-4xl font-bold">{users.filter(u => !u.blocked).length}</p>
            </div>
            <Check size={24} className="opacity-20 sm:w-8 sm:h-8" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-xs sm:text-sm">Blocked Users</p>
              <p className="text-3xl sm:text-4xl font-bold">{users.filter(u => u.blocked).length}</p>
            </div>
            <Ban size={24} className="opacity-20 sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>

      {/* Search and Filter - Responsive */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {['all', 'active', 'blocked'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-semibold transition text-xs sm:text-sm ${
                  filter === f
                    ? 'bg-yellow-500 text-black shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={14} className="inline mr-1" />
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Grid & Table - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Users List - Desktop Table, Mobile Cards */}
        <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold">User</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <tr
                      key={u.id}
                      onClick={() => {
                        setSelectedUser(u);
                        setShowDetails(true);
                      }}
                      className="hover:bg-yellow-50 transition cursor-pointer"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{u.name}</p>
                            <p className="text-xs text-gray-500">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Mail size={14} className="text-gray-400" />
                          <span className="truncate max-w-xs">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          u.blocked
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${u.blocked ? 'bg-red-700' : 'bg-green-700'}`} />
                          {u.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex gap-2 justify-center">
                          {u.blocked ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnblock(u.id);
                              }}
                              className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition"
                              title="Unblock User"
                            >
                              <Check size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBlock(u.id);
                              }}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
                              title="Block User"
                            >
                              <Ban size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      <p className="text-sm">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u);
                    setShowDetails(true);
                  }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Mail size={12} />
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      u.blocked
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${u.blocked ? 'bg-red-700' : 'bg-green-700'}`} />
                      {u.blocked ? 'Blocked' : 'Active'}
                    </span>
                    {u.blocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnblock(u.id);
                        }}
                        className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition text-xs font-semibold flex items-center gap-1"
                      >
                        <Check size={14} /> Unblock
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlock(u.id);
                        }}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition text-xs font-semibold flex items-center gap-1"
                      >
                        <Ban size={14} /> Block
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* User Details Sidebar - Responsive */}
        <div className="lg:col-span-1">
          {selectedUser ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden sticky top-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 sm:p-6">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-yellow-500 mx-auto">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-center">{selectedUser.name}</h3>
                <p className="text-xs sm:text-sm text-center opacity-90 mt-1">User Details</p>
              </div>

              {/* Details Content */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
                  <div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 rounded-lg">
                    <Mail size={14} className="text-gray-400" />
                    <p className="text-xs sm:text-sm break-all">{selectedUser.email}</p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Status</label>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-full justify-center ${
                      selectedUser.blocked
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${selectedUser.blocked ? 'bg-red-700' : 'bg-green-700'}`} />
                      {selectedUser.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                </div>

                {/* User ID */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">User ID</label>
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg text-xs sm:text-sm font-mono">{selectedUser.id}</p>
                </div>

                {/* Actions */}
                <div className="border-t pt-3 sm:pt-4 space-y-2">
                  {selectedUser.blocked ? (
                    <button
                      onClick={() => handleUnblock(selectedUser.id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                    >
                      <Check size={16} />
                      Unblock User
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(selectedUser.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                    >
                      <Ban size={16} />
                      Block User
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 sm:py-3 rounded-lg transition text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center sticky top-6">
              <User size={40} className="mx-auto text-gray-300 mb-3 sm:mb-4 sm:w-12 sm:h-12" />
              <p className="text-gray-600 font-semibold text-sm sm:text-base">Select a user to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
