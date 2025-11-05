import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setMsgType('error');
      setMessage('⚠️ Please fill all fields');
      return;
    }
 // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMsgType('error');
      setMessage('Please enter a valid email address');
      return;
    }

    // ✅ Password validation
    if (password.length < 6) {
      setMsgType('error');
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await axios.get('http://localhost:3000/users');
      const existingUsers = res.data;

      const userExists = existingUsers.find((user) => user.email === email);

      if (userExists) {
        setMsgType('error');
        setMessage('This email is already registered! Please login.');
        return;
      }

      const newUser = { id: Date.now(), name, email, password,isAdmin:false };
      const postRes = await axios.post('http://localhost:3000/users', newUser);

      localStorage.setItem('user', JSON.stringify(postRes.data));

      setMsgType('success');
      setMessage('🎉 Signup successful! Redirecting...');

      setTimeout(() => {
        navigate('/login');
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error saving user:', error);
      setMsgType('error');
      setMessage('Error creating account. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
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

        {/* Input Fields */}
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            onClick={handleSignUp}
            className="bg-green-500 hover:bg-green-600 w-full py-3 rounded-lg font-semibold text-white transition-all duration-200"
          >
            Sign Up
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-green-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
