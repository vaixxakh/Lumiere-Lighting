// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // read stored user (from Login step)
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  // if no user OR user.isAdmin is not true -> redirect to home (or login)
  if (!user || !user.isAdmin) {
    // change redirect to "/login" if you want them to login instead of home
    return <Navigate to="/" replace />;
  }

  // else render admin children (dashboard / admin layout)
  return children;
};

export default AdminRoute;
