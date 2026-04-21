import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AvatarCircle from './AvatarCircle';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  // Hide header on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => {
              console.log('Navigating to dashboard');
              navigate('/dashboard');
              setIsDropdownOpen(false);
            }}
          >
            <div className="text-2xl">🚗</div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SmartPark</h1>
              <p className="text-xs text-gray-500">Campus Parking Hub</p>
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Toggle dropdown');
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {user ? (
                <>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.fullName || user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.userType || user.role || 'User'}</p>
                  </div>
                  <AvatarCircle
                    src={user.avatarUrl}
                    name={user.fullName || user.name || 'User'}
                    size="sm"
                  />
                </>
              ) : (
                <div className="text-sm text-gray-600">Menu</div>
              )}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <div
                  onClick={() => {
                    console.log('View Profile clicked');
                    setIsDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer block"
                >
                  👤 View Profile
                </div>
                <div
                  onClick={() => {
                    console.log('Dashboard clicked');
                    setIsDropdownOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer block"
                >
                  📊 Dashboard
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div
                  onClick={() => {
                    console.log('Logout clicked');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsDropdownOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer block"
                >
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
