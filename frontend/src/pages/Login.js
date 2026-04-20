import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Toast from '../components/Toast';
import { authService } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');

    try {
      // Decode the JWT token from Google
      const token = credentialResponse.credential;
      const decoded = JSON.parse(atob(token.split('.')[1]));

      const loginData = {
        googleId: decoded.sub,
        email: decoded.email,
        fullName: decoded.name,
        imageUrl: decoded.picture,
      };

      const response = await authService.login(loginData);

      if (response.success) {
        // Redirect based on role
        const user = response.user;
        const hasAdminRole = user.roles.includes('ADMIN');
        
        if (hasAdminRole) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">🚗</h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">SmartPark</h2>
          <p className="text-gray-600 mt-2">Campus Vehicle Parking System</p>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-300 mb-8"></div>

        {/* Main Content */}
        <div className="text-center">
          <p className="text-gray-700 mb-6 font-medium">Sign in with your SLIIT Google Account</p>

          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          <div className="border-b border-gray-300 my-6 relative">
            <span className="bg-white px-2 text-gray-600 text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              or
            </span>
          </div>

          {/* Register Link */}
          <p className="text-gray-700 mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              Register here
            </button>
          </p>
        </div>

        {/* Footer Links */}
        <div className="border-t border-gray-300 mt-8 pt-6 flex justify-center gap-4 text-sm">
          <button type="button" className="text-gray-600 hover:text-blue-600 transition">
            Privacy Policy
          </button>
          <span className="text-gray-400">•</span>
          <button type="button" className="text-gray-600 hover:text-blue-600 transition">
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
