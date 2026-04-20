import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import Button from '../components/Button';
import { adminTicketService } from '../services/adminTicketService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [open, inProgress, resolved] = await Promise.all([
          adminTicketService.listTickets('OPEN'),
          adminTicketService.listTickets('IN_PROGRESS'),
          adminTicketService.listTickets('RESOLVED'),
        ]);
        if (!cancelled) {
          setCounts({
            open: Array.isArray(open) ? open.length : 0,
            inProgress: Array.isArray(inProgress) ? inProgress.length : 0,
            resolved: Array.isArray(resolved) ? resolved.length : 0,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <AppLayout
      title="Admin Dashboard"
      actions={<Button onClick={() => navigate('/admin/tickets')}>Go to Tickets</Button>}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Open</div>
          <div className="mt-2 text-3xl font-extrabold">{loading ? '—' : counts.open}</div>
          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/tickets')}>Review</Button>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">In Progress</div>
          <div className="mt-2 text-3xl font-extrabold">{loading ? '—' : counts.inProgress}</div>
          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/tickets')}>Continue</Button>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Resolved</div>
          <div className="mt-2 text-3xl font-extrabold">{loading ? '—' : counts.resolved}</div>
          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/tickets')}>Close</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;

