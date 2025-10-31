import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      // Get all existing users
      const res = await axios.get('http://localhost:3000/users');
      const existingUsers = res.data;

      // Check if email already exists (only check email, not all fields)
      const userExists = existingUsers.find((user) => user.email === email);

      if (userExists) {
        alert('This email is already registered! Please login.');
        return;
      }

      // Create new user
      const newUser = { id: Date.now(), name, email, password };
      const postRes = await axios.post('http://localhost:3000/users', newUser);

      // Save user locally
      localStorage.setItem('user', JSON.stringify(postRes.data));

      alert('Signup successful!');
      console.log('User saved:', postRes.data);

      // Clear inputs
      setName('');
      setEmail('');
      setPassword('');

      // Navigate to home
      navigate('/');
      
      // Reload to update navbar visibility
      window.location.reload();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error creating account. Please try again.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />
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
        onClick={handleSignUp}
        className="bg-green-500 hover:bg-green-600 w-full py-2 rounded text-white font-semibold"
      >
        Sign Up
      </button>
    </div>
  );
}

export default SignUp;
