import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    // Validation
    if (!email || !password) {
      setMsgType('error');
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // First check if it's admin login
      if (email === 'admin@lumiere.com' && password === 'admin@916') {
        localStorage.setItem('adminToken', 'true');
        localStorage.setItem('user', JSON.stringify({ 
          email, 
          name: 'Admin', 
          isAdmin: true 
        }));
        
        setMsgType('success');
        setMessage('Welcome Admin! Login Successful!');
        setLoading(false);

        setTimeout(() => {
          navigate('/admin');
          window.location.reload();
        }, 1200);
        return;
      }

      // Otherwise, check regular user login from database
      const res = await axios.get('https://6916c7aba7a34288a27e5552.mockapi.io/users');
      const users = res.data;
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        // Check if user is blocked
        if (user.blocked) {
          setMsgType('error');
          setMessage('Your account has been blocked. Please contact support.');
          setLoading(false);
          return;
        }

        localStorage.setItem('user', JSON.stringify(user));
        setMsgType('success');
        setMessage(`Welcome back, ${user.name}! Login Successful!`);
        setLoading(false);

        setTimeout(() => {
          if (user.isAdmin === true) {
            navigate('/admin');
          } else {
            navigate('/');
          }
          window.location.reload();
        }, 1200);
      } else {
        setMsgType('error');
        setMessage('Invalid email or password!');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setMsgType('error');
      setMessage('⚠️ Error while logging in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">Lu</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 text-sm mt-2">Login to your Lumiere account</p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Message Box */}
        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-white text-center font-medium transition-all duration-300 ${
              msgType === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              disabled={loading}
            />
          </div>

          {/* Password Input with Show/Hide */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10 transition"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 w-full py-3 rounded-lg font-bold text-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">New to Lumiere?</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-yellow-600 hover:text-yellow-700 font-semibold hover:underline cursor-pointer"
          >
            Sign up for free
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;
