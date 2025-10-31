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
      // Get all registered users
      const res = await axios.get('http://localhost:3000/users');
      const users = res.data;

      // Check if user exists
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(user));

        setMsgType('success');
        setMessage(`Welcome back, ${user.name}! Login Successful!`);
        
        setTimeout(() => {
          navigate('/');
          // Reload to update navbar visibility
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
    <div className="flex flex-col items-center mt-10">
      {/* Animated Message Box */}
      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded-lg text-white font-semibold animate-fade-in
            ${msgType === 'success' ? 'bg-green-500' : 'bg-red-500'}
          `}
        >
          {message}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-yellow-400 hover:bg-yellow-500 w-full py-2 rounded font-semibold"
      >
        Login
      </button>
    </div>
  );
}

export default Login;
