import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Toast from '../components/Toast';
import { authService } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
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
        const user = response.user;
        const hasAdminRole = user.roles && user.roles.includes('ADMIN');
        const hasTechnicianRole = user.roles && user.roles.includes('TECHNICIAN');
        
        // If user is staff/admin, sync tokens for the admin portal
        if (hasAdminRole || hasTechnicianRole) {
          localStorage.setItem('adminToken', response.token);
          localStorage.setItem('adminUser', JSON.stringify(user));
        }
        
        if (hasAdminRole) {
          navigate('/admin/dashboard');
        } else if (hasTechnicianRole) {
          navigate('/admin/technician');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center p-4">
      {error && <Toast message={error} type="error" duration={4000} />}

      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white pr-12">
        <div className="space-y-6">
          <div>
            <div className="text-8xl font-bold mb-4">🚗</div>
            <h1 className="text-5xl font-bold mb-2">SmartPark</h1>
            <p className="text-xl text-blue-100">Campus Vehicle Parking System</p>
          </div>
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⏱️</span>
              <div>
                <h3 className="text-xl font-semibold">Quick & Easy</h3>
                <p className="text-blue-100">Book parking slots in seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="text-xl font-semibold">Real-time Availability</h3>
                <p className="text-blue-100">See available slots instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">📱</span>
              <div>
                <h3 className="text-xl font-semibold">Manage Reports</h3>
                <p className="text-blue-100">Report and track maintenance issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8 text-white">
            <h1 className="text-4xl font-bold mb-2">SmartPark</h1>
            <p className="text-blue-100">Campus Parking Hub</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
            {/* Card Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            {/* Login Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sign in with your SLIIT Google Account
                </label>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    width="100%"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">New to SmartPark?</span>
                </div>
              </div>

              {/* Register Link */}
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-600 font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
              >
                Create an Account
              </button>

              <button
                onClick={() => navigate('/admin/login')}
                className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
              >
                Login as Admin
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center text-white text-sm">
            <p>🔒 Your data is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


