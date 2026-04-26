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
        if (hasAdminRole || hasTechnicianRole) {
          localStorage.setItem('adminToken', response.token);
          localStorage.setItem('adminUser', JSON.stringify(user));
        }
        if (hasAdminRole) navigate('/admin/dashboard');
        else if (hasTechnicianRole) navigate('/admin/technician');
        else navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => setError('Google login failed. Please try again.');

  return (
    <div className="min-h-screen relative flex items-stretch overflow-hidden">
      {error && <Toast message={error} type="error" duration={4000} />}

      {/* Full-screen background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/empty-parking-lots-aerial-view.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      {/* Gradient overlay — darker on right where card sits, lighter left to show photo */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(110deg, rgba(2,12,40,0.45) 0%, rgba(3,18,60,0.70) 40%, rgba(1,10,35,0.93) 100%)',
        }}
      />

      {/* Layout */}
      <div className="relative z-10 w-full flex items-center justify-between max-w-7xl mx-auto px-8 lg:px-20 py-10 gap-8">

        {/* ── LEFT: Branding ── */}
        <div className="hidden lg:flex flex-col justify-center flex-1 max-w-xl text-white">

          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <img
              src="/Untitled design (1).png"
              alt="SmartPark Campus"
              className="w-40 h-40 object-contain drop-shadow-lg"
            />
            <div>
              <p className="text-3xl font-black tracking-tight leading-none">SmartPark</p>
              <p className="text-green-400 text-xs font-bold tracking-[0.25em] uppercase mt-0.5">Campus</p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-6xl font-black leading-[1.05] mb-5 drop-shadow-lg">
            Park<br />
            <span
              style={{
                background: 'linear-gradient(90deg, #38bdf8, #4ade80)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Smarter.
            </span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-sm">
            The campus parking system built for SLIIT. Reserve a slot, track your vehicle, and stay hassle-free.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mb-12">
            {[
              { value: '500+', label: 'Parking Slots' },
              { value: '24/7', label: 'Availability' },
              { value: '3 sec', label: 'To Book' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-gray-400 text-xs uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: '⚡', text: 'Instant booking' },
              { icon: '🗺️', text: 'Live zone map' },
              { icon: '🔔', text: 'Smart alerts' },
              { icon: '🛠️', text: 'Issue reporting' },
            ].map((f) => (
              <span
                key={f.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {f.icon} {f.text}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Login Card ── */}
        <div className="w-full max-w-sm flex-shrink-0 mx-auto lg:mx-0">

          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8 text-white">
            <img
              src="/Untitled design (1).png"
              alt="SmartPark Campus"
              className="w-28 h-28 object-contain mb-3 drop-shadow-lg"
            />
            <p className="text-3xl font-black">SmartPark</p>
            <p className="text-green-400 text-xs font-bold tracking-widest uppercase">Campus</p>
          </div>

          {/* Card */}
          <div
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(32px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Card top accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9, #4ade80)' }}
            />

            <div className="p-8">
              {/* Card header */}
              <div className="mb-8">
                <h2 className="text-2xl font-black text-white">Welcome Back</h2>
                <p className="text-gray-400 text-sm mt-1">Sign in to your SLIIT account to continue</p>
              </div>

              {/* Google login */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  Continue with Google
                </p>

                {loading ? (
                  <div className="flex items-center justify-center gap-3 py-4 text-sky-400">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-sm font-medium">Signing you in…</span>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                      width="280"
                    />
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <span className="text-xs text-gray-500 font-medium">New here?</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              </div>

              {/* Create account */}
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 mb-3 group"
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
                  boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
                  color: '#fff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(14,165,233,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,165,233,0.35)';
                }}
              >
                Create an Account
              </button>

              {/* Admin login */}
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full py-3 rounded-xl font-semibold text-sm text-gray-300 transition-all duration-200 flex items-center justify-center gap-2 hover:text-white"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Login as Admin
              </button>

              {/* Footer note */}
              <p className="text-center text-xs text-gray-600 mt-6">
                By signing in you agree to our Terms &amp; Privacy Policy
              </p>
            </div>
          </div>

          {/* Below card */}
          <p className="text-center text-xs text-gray-500 mt-5 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secured &amp; encrypted · SmartPark Campus v1.0
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
