import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export const ProtectedRoute = ({ children }) => {
  const token = authService.getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const token = authService.getToken();
  const user = authService.getUser();
  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN') || roles.includes('WARDEN');
  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

export const StaffRoute = ({ children }) => {
  const token = authService.getToken();
  const user = authService.getUser();
  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN') || roles.includes('WARDEN');
  if (!token) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (user?.userType !== 'STAFF') return <Navigate to="/dashboard" replace />;
  return children;
};

export const StudentRoute = ({ children }) => {
  const token = authService.getToken();
  const user = authService.getUser();
  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN') || roles.includes('WARDEN');
  if (!token) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (user?.userType !== 'STUDENT') return <Navigate to="/dashboard" replace />;
  return children;
};
