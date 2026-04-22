import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import Header from './components/Header';
import { ToastProvider } from './context/ToastContext';
import './App.css';

const GOOGLE_CLIENT_ID = '645115511045-86514437mn48ffcsq67s7t9v32doqfrj.apps.googleusercontent.com';

// Protected Route Component
const ProtectedRoute = ({ component: Component }) => {
  const token = localStorage.getItem('token');
  return token ? <Component /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ToastProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
            <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
            <Route path="/profile/edit" element={<ProtectedRoute component={Profile} />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* Placeholder routes - implement these components later */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<div className="p-8"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p>Coming soon...</p></div>} />
          </Routes>
        </Router>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
