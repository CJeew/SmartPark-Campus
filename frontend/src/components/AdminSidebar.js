import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

const Icons = {
  zones: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  dashboard: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  users: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  bookings: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  helmetRack: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3a7 7 0 00-7 7v4a5 5 0 005 5h4a5 5 0 005-5v-4a7 7 0 00-7-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12h6M10 16h4" />
    </svg>
  ),
  logout: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
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

const AdminSidebar = ({ pendingBookings = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = adminService.getAdmin();

  const handleLogout = () => {
    const isTechnicianUser = admin?.roles?.includes('TECHNICIAN') && !admin?.roles?.includes('ADMIN');
    adminService.logout();
    
    if (isTechnicianUser) {
      // Also clear regular user tokens since Technicians log in via the User Portal
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      navigate('/admin/login');
    }
  };

  const isActive = (path) => location.pathname === path;
  const isTechnician = admin?.roles?.includes('TECHNICIAN') && !admin?.roles?.includes('ADMIN');
  const dashboardPath = isTechnician ? '/admin/technician' : '/admin/dashboard';

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-gray-700/60">
        <div className="flex items-center gap-2">
          <img
            src="/Untitled design (1).png"
            alt="SmartPark Campus"
            className="w-9 h-9 object-contain flex-shrink-0"
          />
          <div>
            <h1 className="text-base font-bold leading-tight">SmartPark</h1>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <NavItem
          icon={Icons.dashboard}
          label="Dashboard"
          active={isActive('/admin/dashboard') || isActive('/admin/technician')}
          onClick={() => navigate(dashboardPath)}
        />
        {admin?.roles?.includes('ADMIN') && (
          <NavItem
            icon={Icons.users}
            label="Users"
            active={isActive('/admin/users')}
            onClick={() => navigate('/admin/users')}
          />
        )}
        {admin?.roles?.includes('ADMIN') && (
          <NavItem
            icon={Icons.bookings}
            label="Bookings"
            active={isActive('/admin/bookings')}
            onClick={() => navigate('/admin/bookings')}
            badge={pendingBookings}
          />
        )}
        {admin?.roles?.includes('ADMIN') && (
          <NavItem
            icon={Icons.zones}
            label="Parking Zones"
            active={isActive('/admin/zones')}
            onClick={() => navigate('/admin/zones')}
          />
        )}
        {(admin?.roles?.includes('ADMIN') || admin?.roles?.includes('TECHNICIAN')) && (
          <NavItem
            icon={Icons.helmetRack}
            label="Helmet Rack"
            active={isActive('/admin/helmet-rack')}
            onClick={() => navigate('/admin/helmet-rack')}
          />
        )}
      </nav>

      <div className="px-3 py-4 border-t border-gray-700/60">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
            {admin?.fullName?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{admin?.fullName ?? 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{admin?.email ?? ''}</p>
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

export default AdminSidebar;
