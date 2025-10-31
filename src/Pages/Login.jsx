import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

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
          navigate('/');
          window.location.reload();
        }, 1500);
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

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            onClick={handleLogin}
            className="bg-yellow-400 hover:bg-yellow-500 w-full py-3 rounded-lg font-semibold text-gray-800 transition-all duration-200"
          >
            Login
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don’t have an account?{' '}
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
