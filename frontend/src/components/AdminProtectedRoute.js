import React from 'react';
import { Navigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

const AdminProtectedRoute = ({ children }) => {
  if (!adminService.isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AdminProtectedRoute;
