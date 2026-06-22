import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// Checks localStorage flag set on login/signup
// If not logged in, redirect to /login
const PrivateRoute = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
