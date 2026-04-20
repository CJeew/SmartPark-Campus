import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import Button from '../components/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import StatusBadge from '../components/tickets/StatusBadge';
import PriorityBadge from '../components/tickets/PriorityBadge';
import TagBadge from '../components/tickets/TagBadge';
import { adminTicketService } from '../services/adminTicketService';

const AdminTicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await adminTicketService.getById(ticketId);
        if (!cancelled) setTicket(data);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load ticket');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ticketId]);

  const setStatus = async (nextStatus) => {
    setMutating(true);
    setError('');
    try {
      const updated = await adminTicketService.updateStatus(ticketId, nextStatus);
      setTicket(updated);
    } catch (e) {
      setError(e?.message || 'Failed to update status');
    } finally {
      setMutating(false);
    }
  };

  return (
    <AppLayout
      title="Admin · Ticket Details"
      actions={<Button variant="secondary" onClick={() => navigate('/admin/tickets')}>Back</Button>}
    >
      {loading ? <LoadingSkeleton rows={2} /> : null}

      {!loading && error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
      ) : null}

      {!loading && ticket ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <TagBadge tag={ticket.tag} />
          </div>

          <div className="mt-3 text-xs text-gray-500">Student/User ID: {ticket.createdByUserId}</div>

          <div className="mt-5 text-lg font-bold text-gray-900">{ticket.title}</div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{ticket.description}</div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={mutating || ticket.status === 'IN_PROGRESS'}
              onClick={() => setStatus('IN_PROGRESS')}
            >
              Mark In Progress
            </Button>
            <Button
              size="sm"
              disabled={mutating || ticket.status === 'RESOLVED'}
              loading={mutating}
              onClick={() => setStatus('RESOLVED')}
            >
              Mark Resolved
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={mutating || ticket.status === 'CLOSED'}
              onClick={() => setStatus('CLOSED')}
            >
              Close
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={mutating || ticket.status === 'REJECTED'}
              onClick={() => setStatus('REJECTED')}
            >
              Reject
            </Button>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
};

export default AdminTicketDetails;
