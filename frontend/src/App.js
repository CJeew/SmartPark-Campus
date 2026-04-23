import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ParkingZones from './pages/ParkingZones';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminBookings from './pages/AdminBookings';
import ZoneManagement from './pages/admin/ZoneManagement';
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
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
            <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
            <Route path="/profile/edit" element={<ProtectedRoute component={Profile} />} />
            <Route path="/zones" element={<ProtectedRoute component={ParkingZones} />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/zones" element={<ZoneManagement />} />
          </Routes>
        </Router>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
