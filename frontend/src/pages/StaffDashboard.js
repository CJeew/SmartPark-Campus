import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import Button from '../components/Button';
import { authService } from '../services/authService';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN') || roles.includes('WARDEN');

  return (
    <AppLayout
      title="Staff Dashboard"
      actions={<Button onClick={() => navigate('/tickets/new')}>Create Ticket</Button>}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">My Tickets</div>
          <div className="mt-1 text-sm text-gray-600">Your submitted requests and statuses.</div>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/my-tickets')}>Open My Tickets</Button>
          </div>
        </div>

        {isAdmin ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-gray-900">Admin Tickets</div>
            <div className="mt-1 text-sm text-gray-600">Resolve tickets raised by students/staff.</div>
            <div className="mt-4">
              <Button onClick={() => navigate('/admin/tickets')}>Manage Tickets</Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-gray-900">Support</div>
            <div className="mt-1 text-sm text-gray-600">Admins/wardens can resolve tickets.</div>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => navigate('/my-tickets')}>View Tickets</Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default StaffDashboard;

