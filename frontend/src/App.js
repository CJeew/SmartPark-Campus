import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ParkingZones from './pages/ParkingZones';
import Notifications from './pages/Notifications';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminBookings from './pages/AdminBookings';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AdminHelmetRack from './pages/AdminHelmetRack';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ZoneManagement from './pages/admin/ZoneManagement';
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
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
            <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
            <Route path="/profile/edit" element={<ProtectedRoute component={Profile} />} />
            <Route path="/zones" element={<ProtectedRoute component={ParkingZones} />} />
            <Route path="/notifications" element={<ProtectedRoute component={Notifications} />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="/admin/technician" element={<AdminProtectedRoute><TechnicianDashboard /></AdminProtectedRoute>} />
            <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
            <Route path="/admin/bookings" element={<AdminProtectedRoute><AdminBookings /></AdminProtectedRoute>} />
            <Route path="/admin/zones" element={<AdminProtectedRoute><ZoneManagement /></AdminProtectedRoute>} />
            <Route path="/admin/helmet-rack" element={<AdminProtectedRoute><AdminHelmetRack /></AdminProtectedRoute>} />
          </Routes>
        </Router>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
