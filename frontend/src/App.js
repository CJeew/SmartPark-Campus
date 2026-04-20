import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardRouter from './pages/DashboardRouter';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MyTickets from './pages/MyTickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import AdminTickets from './pages/AdminTickets';
import AdminTicketDetails from './pages/AdminTicketDetails';
import { AdminRoute, ProtectedRoute, StaffRoute, StudentRoute } from './components/common/RouteGuards';
import './App.css';

const GOOGLE_CLIENT_ID = '645115511045-86514437mn48ffcsq67s7t9v32doqfrj.apps.googleusercontent.com';

// moved route guards to `components/common/RouteGuards.js`

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard/student"
            element={(
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            )}
          />
          <Route
            path="/dashboard/staff"
            element={(
              <StaffRoute>
                <StaffDashboard />
              </StaffRoute>
            )}
          />
          <Route
            path="/my-tickets"
            element={(
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tickets/new"
            element={(
              <ProtectedRoute>
                <CreateTicket />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tickets/:ticketId"
            element={(
              <ProtectedRoute>
                <TicketDetails />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/admin/dashboard"
            element={(
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/tickets"
            element={(
              <AdminRoute>
                <AdminTickets />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/tickets/:ticketId"
            element={(
              <AdminRoute>
                <AdminTicketDetails />
              </AdminRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
