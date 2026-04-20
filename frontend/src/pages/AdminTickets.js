import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import Tabs from '../components/common/Tabs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/Button';
import StatusBadge from '../components/tickets/StatusBadge';
import PriorityBadge from '../components/tickets/PriorityBadge';
import TagBadge from '../components/tickets/TagBadge';
import { adminTicketService } from '../services/adminTicketService';

const TAB_KEYS = {
  ALL: 'ALL',
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
};

const AdminTickets = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_KEYS.OPEN);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState(null);
  const [error, setError] = useState('');

  const tabs = useMemo(() => ([
    { key: TAB_KEYS.OPEN, label: 'Open', status: 'OPEN' },
    { key: TAB_KEYS.IN_PROGRESS, label: 'In Progress', status: 'IN_PROGRESS' },
    { key: TAB_KEYS.RESOLVED, label: 'Resolved', status: 'RESOLVED' },
    { key: TAB_KEYS.CLOSED, label: 'Closed', status: 'CLOSED' },
    { key: TAB_KEYS.ALL, label: 'All', status: null },
    { key: TAB_KEYS.REJECTED, label: 'Rejected', status: 'REJECTED' },
  ]), []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const tab = tabs.find((t) => t.key === activeTab) || tabs[0];
      const data = await adminTicketService.listTickets(tab.status);
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const tab = tabs.find((t) => t.key === activeTab) || tabs[0];
        const data = await adminTicketService.listTickets(tab.status);
        if (!cancelled) setTickets(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load tickets');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeTab, tabs]);

  const setStatus = async (ticketId, nextStatus) => {
    setMutatingId(ticketId);
    setError('');
    try {
      await adminTicketService.updateStatus(ticketId, nextStatus);
      await load();
    } catch (e) {
      setError(e?.message || 'Failed to update status');
    } finally {
      setMutatingId(null);
    }
  };

  return (
    <AppLayout title="Admin · Tickets">
      <div className="space-y-4">
        <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
        ) : null}

        {loading ? <LoadingSkeleton rows={3} /> : null}

        {!loading && tickets.length === 0 ? (
          <EmptyState
            title="No tickets found"
            description="Try another status filter."
          />
        ) : null}

        {!loading && tickets.length > 0 ? (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-base font-bold text-gray-900">{t.title}</div>
                      <StatusBadge status={t.status} />
                      <PriorityBadge priority={t.priority} />
                      <TagBadge tag={t.tag} />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Student/User ID: {t.createdByUserId}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/tickets/${t.id}`)}
                    >
                      View
                    </Button>

                    {(t.status === 'OPEN' || t.status === 'IN_PROGRESS') ? (
                      <Button
                        size="sm"
                        disabled={mutatingId === t.id}
                        loading={mutatingId === t.id}
                        onClick={() => setStatus(t.id, 'RESOLVED')}
                      >
                        Mark Resolved
                      </Button>
                    ) : null}

                    {t.status === 'RESOLVED' ? (
                      <Button
                        size="sm"
                        disabled={mutatingId === t.id}
                        loading={mutatingId === t.id}
                        onClick={() => setStatus(t.id, 'CLOSED')}
                      >
                        Close
                      </Button>
                    ) : null}

                    {t.status === 'OPEN' ? (
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={mutatingId === t.id}
                        onClick={() => setStatus(t.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 max-h-12 overflow-hidden text-sm text-gray-600">{t.description}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
};

export default AdminTickets;

