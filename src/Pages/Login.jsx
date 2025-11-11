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

  const handleLogin = async () => {
    if (!email || !password) {
      setMsgType('error');
      setMessage('Please fill all fields');
      return;
    }

    try {
      const res = await axios.get('http://localhost:3000/users');
      const users = res.data;
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setMsgType('success');
        setMessage(`Welcome back, ${user.name}! Login Successful!`);

        setTimeout(() => {
          if (user.isAdmin === true) {
            navigate('/admin'); //  Redirect admin
          } else {
            navigate('/'); //  Redirect normal user
          }
          window.location.reload();
        }, 1200);
      } else {
        setMsgType('error');
        setMessage('Invalid email or password!');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setMsgType('error');
      setMessage('⚠️ Error while logging in. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        <div className='mb-8'>
           <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold mb-6 transition"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

        </div>
        {/* Message Box */}
        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg text-white text-center font-medium transition-all duration-300 ${
              msgType === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {message}
          </div>
        )}

        {/* Form Inputs */}
        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Password Input with Show/Hide */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="bg-yellow-400 hover:bg-yellow-500 w-full py-3 rounded-lg font-semibold text-gray-800 transition-all duration-200"
          >
            Login
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-yellow-600 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
