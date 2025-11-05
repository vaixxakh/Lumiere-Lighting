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

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'active') return matchesSearch && !u.blocked;
    if (filter === 'blocked') return matchesSearch && u.blocked;
    return matchesSearch;
  });

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Total Users: <span className="font-bold text-yellow-500">{users.length}</span></p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Users</p>
              <p className="text-4xl font-bold">{users.length}</p>
            </div>
            <User size={32} className="opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Users</p>
              <p className="text-4xl font-bold">{users.filter(u => !u.blocked).length}</p>
            </div>
            <Check size={32} className="opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Blocked Users</p>
              <p className="text-4xl font-bold">{users.filter(u => u.blocked).length}</p>
            </div>
            <Ban size={32} className="opacity-20" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {['all', 'active', 'blocked'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                  filter === f
                    ? 'bg-yellow-500 text-black shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={16} className="inline mr-1" />
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Grid & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">User</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
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
                    {/* User Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-500">ID: {u.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        u.blocked
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${u.blocked ? 'bg-red-700' : 'bg-green-700'}`} />
                        {u.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        {u.blocked ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnblock(u.id);
                            }}
                            className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition flex items-center gap-1"
                            title="Unblock User"
                          >
                            <Check size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBlock(u.id);
                            }}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition flex items-center gap-1"
                            title="Block User"
                          >
                            <Ban size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    <p className="text-lg">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* User Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedUser ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-yellow-500 mx-auto">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center">{selectedUser.name}</h3>
                <p className="text-sm text-center opacity-90 mt-1">User Details</p>
              </div>

              {/* Details Content */}
              <div className="p-6 space-y-4">
                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
                  <div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 rounded-lg">
                    <Mail size={16} className="text-gray-400" />
                    <p className="text-sm break-all">{selectedUser.email}</p>
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
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg text-sm font-mono">{selectedUser.id}</p>
                </div>

                {/* Actions */}
                <div className="border-t pt-4 space-y-2">
                  {selectedUser.blocked ? (
                    <button
                      onClick={() => handleUnblock(selectedUser.id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      Unblock User
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(selectedUser.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Ban size={18} />
                      Block User
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center sticky top-6">
              <User size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-semibold">Select a user to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
