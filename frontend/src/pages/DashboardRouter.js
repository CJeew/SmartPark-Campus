import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const DashboardRouter = () => {
  const user = authService.getUser();
  const roles = user?.roles || [];
  const userType = user?.userType;

  const isAdmin = roles.includes('ADMIN') || roles.includes('WARDEN');
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (userType === 'STAFF') return <Navigate to="/dashboard/staff" replace />;
  return <Navigate to="/dashboard/student" replace />;
};

export default DashboardRouter;

