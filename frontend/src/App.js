import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
import './App.css';

const GOOGLE_CLIENT_ID = '645115511045-86514437mn48ffcsq67s7t9v32doqfrj.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminProtectedRoute>
                <AdminBookings />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUsers />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<div className="p-8"><h1 className="text-2xl font-bold">User Dashboard</h1><p>Coming soon...</p></div>} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
