import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import Button from '../components/Button';

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout
      title="Student Dashboard"
      actions={<Button onClick={() => navigate('/tickets/new')}>Create Ticket</Button>}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">My Tickets</div>
          <div className="mt-1 text-sm text-gray-600">Track your incident/maintenance requests.</div>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/my-tickets')}>Open My Tickets</Button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">New Ticket</div>
          <div className="mt-1 text-sm text-gray-600">Report an issue in parking areas.</div>
          <div className="mt-4">
            <Button onClick={() => navigate('/tickets/new')}>Create Ticket</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;

