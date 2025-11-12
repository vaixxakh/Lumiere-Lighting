import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Box, Users, List, LogOut, Menu, X,   } from 'lucide-react';


const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);


  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      navigate('/login');
    }
  };


  const isActive = (path) => location.pathname === path;


  const navLinks = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/admin/products', label: 'Products', icon: Box },
    { path: '/admin/orders', label: 'Orders', icon: List },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];


  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar - Fixed */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 h-full flex flex-col transition-transform duration-300 shadow-2xl`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-xl">L</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Lumiere</h1>
              <p className="text-xs text-yellow-400 font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>


        {/* Navigation - Scrollable if needed */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => {
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive(path)
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive(path) ? '' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-semibold">{label}</span>
              {isActive(path) && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          ))}
        </nav>


        {/* Logout Button - Fixed at bottom */}
        <div className="p-4 border-t border-gray-700 space-y-2 flex-shrink-0">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <p className="text-xs text-gray-500 text-center">Click to exit admin panel</p>
        </div>
      </aside>


      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header - Fixed */}
        <header className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 p-6 shadow-sm flex-shrink-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {sidebarOpen ? (
                  <X size={24} className="text-gray-600" />
                ) : (
                  <Menu size={24} className="text-gray-600" />
                )}
              </button>


              {/* Header Title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
                <p className="text-sm text-gray-600">
                  {navLinks.find(l => isActive(l.path))?.label || 'Dashboard'}
                </p>
              </div>
            </div>


            {/* Right Actions */}
            <div className="flex items-center gap-4">


              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                    A
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-gray-800">Admin</p>
                    <p className="text-xs text-gray-600">Super Admin</p>
                  </div>
                </button>


                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-gray-900">
                      <p className="font-bold">Admin User</p>
                      <p className="text-xs opacity-80">admin@lumiere.com</p>
                    </div>
                    <div className="space-y-1 p-2">
                      {/* <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition">
                        <UserIcon size={16} />
                        <span className="text-sm">Profile Settings</span>
                      </button>
                      <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition">
                        <Settings size={16} />
                        <span className="text-sm">Preferences</span>
                      </button> */}
                      {/* <hr className="my-1" /> */}
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <LogOut size={16} />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>


        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>


      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};


export default AdminLayout;
