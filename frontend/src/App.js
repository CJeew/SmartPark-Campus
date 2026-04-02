import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const GOOGLE_CLIENT_ID = '645115511045-86514437mn48ffcsq67s7t9v32doqfrj.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Placeholder routes - implement these components later */}
          <Route path="/dashboard" element={<div className="p-8"><h1 className="text-2xl font-bold">User Dashboard</h1><p>Coming soon...</p></div>} />
          <Route path="/admin/dashboard" element={<div className="p-8"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p>Coming soon...</p></div>} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
