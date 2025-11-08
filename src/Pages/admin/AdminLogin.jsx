import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@lumiere.com' && password === 'admin@916') {
        localStorage.setItem('adminToken', 'true');
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        }
        setLoading(false);
        navigate('/admin');
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 500);
  };

  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const isFormValid = email && password && !loading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500 opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-600 opacity-10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md mx-auto px-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 pt-8 pb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl font-bold text-yellow-600">L</span>
              </div>
              <h1 className="text-4xl font-black text-white mb-2">Lumiere</h1>
              <p className="text-yellow-100 font-semibold">Admin Dashboard</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3 animate-shake">
                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition z-10" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                  placeholder="admin@lumiere.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition z-10" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer appearance-none checked:bg-yellow-500 checked:border-yellow-500 transition-all"
                    disabled={loading}
                  />
                  <CheckCircle className="absolute inset-0 w-5 h-5 text-white pointer-events-none hidden checked:block" size={16} />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 transition">
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full py-4 px-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isFormValid
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600 font-semibold">Security Credentials</span>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-600">
              Protected by <span className="font-bold text-gray-800">Lumiere Security</span> • 
              <a href="#" className="text-yellow-600 hover:text-yellow-700 font-semibold ml-1">Help</a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Back to <a href="/" className="text-yellow-500 hover:text-yellow-400 font-bold transition">Home</a>
          </p>
        </div>
      </div>

      {/* Styles for animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        input[type="checkbox"]:checked + svg {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
