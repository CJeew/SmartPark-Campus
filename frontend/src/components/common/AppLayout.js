import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../Button';
import { authService } from '../../services/authService';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const active = location.pathname === to;
  const cls = active ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900';
  return (
    <Link to={to} className={`text-sm font-semibold ${cls}`}>
      {children}
    </Link>
  );
};

const AppLayout = ({ title, actions, children }) => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN') || roles.includes('WARDEN');

  const onLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="text-sm font-extrabold tracking-wide">SmartPark</div>
            <div className="flex items-center gap-3">
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/my-tickets">My Tickets</NavLink>
              <NavLink to="/tickets/new">New Ticket</NavLink>
              {isAdmin ? <NavLink to="/admin/tickets">Admin Tickets</NavLink> : null}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-xs text-gray-500 sm:block">
              {user?.fullName ? `Signed in as ${user.fullName}` : 'Signed in'}
            </div>
            <Button size="sm" variant="outline" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="text-2xl font-bold">{title}</div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
