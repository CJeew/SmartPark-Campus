import React from 'react';
import { useNavigate } from 'react-router-dom';

const Icons = {
  overview: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  browse: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  bookings: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  issue: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  tickets: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v3H5V5zm0 8a2 2 0 012-2h10a2 2 0 012 2v3H5v-3z" />
    </svg>
  ),
  profile: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  logout: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    <span className="w-5 h-5 flex-shrink-0">{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge != null && badge > 0 && (
      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
        {badge}
      </span>
    )}
  </button>
);

const UserSidebar = ({ activeSection, onNavChange, openTicketsCount = 0 }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { key: 'overview',      label: 'Overview',             icon: Icons.overview },
    { key: 'browse-zones',  label: 'Browse Parking Zones', icon: Icons.browse },
    { key: 'my-bookings',   label: 'My Bookings',          icon: Icons.bookings },
    { key: 'report-issue',  label: 'Report an Issue',      icon: Icons.issue },
    { key: 'my-tickets',    label: 'My Tickets',           icon: Icons.tickets, badge: openTicketsCount },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 min-h-screen">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-700/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm font-bold">S</div>
          <div>
            <h1 className="text-base font-bold leading-tight">SmartPark</h1>
            <p className="text-gray-400 text-xs">Campus Parking</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={activeSection === item.key}
            onClick={() => onNavChange(item.key)}
            badge={item.badge}
          />
        ))}

        <div className="pt-4 mt-4 border-t border-gray-700/60">
          <NavItem
            icon={Icons.profile}
            label="My Profile"
            active={activeSection === 'profile'}
            onClick={() => navigate('/profile')}
          />
        </div>
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-gray-700/60">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
            {user?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.fullName ?? 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email ?? ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
        >
          {Icons.logout}
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
