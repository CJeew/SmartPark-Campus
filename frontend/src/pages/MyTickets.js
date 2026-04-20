import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import Tabs from '../components/common/Tabs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import TicketCard from '../components/tickets/TicketCard';
import Button from '../components/Button';
import { ticketService } from '../services/ticketService';

const TAB_KEYS = {
  ALL: 'ALL',
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

const MyTickets = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_KEYS.ALL);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tabs = useMemo(() => ([
    { key: TAB_KEYS.ALL, label: 'All', status: null },
    { key: TAB_KEYS.OPEN, label: 'Open', status: 'OPEN' },
    { key: TAB_KEYS.IN_PROGRESS, label: 'In Progress', status: 'IN_PROGRESS' },
    { key: TAB_KEYS.RESOLVED, label: 'Resolved', status: 'RESOLVED' },
    { key: TAB_KEYS.CLOSED, label: 'Closed', status: 'CLOSED' },
  ]), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const tab = tabs.find((t) => t.key === activeTab) || tabs[0];
        const data = await ticketService.listMyTickets(tab.status);
        if (!cancelled) setTickets(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load tickets');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeTab, tabs]);

  return (
    <AppLayout
      title="My Tickets"
      actions={<Button onClick={() => navigate('/tickets/new')}>Create Ticket</Button>}
    >
      <div className="space-y-4">
        <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
        ) : null}

        {loading ? <LoadingSkeleton rows={3} /> : null}

        {!loading && tickets.length === 0 ? (
          <EmptyState
            title="No tickets submitted yet"
            description="Create a ticket to report an incident or request maintenance."
            action={<Button onClick={() => navigate('/tickets/new')}>Create Ticket</Button>}
          />
        ) : null}

        {!loading && tickets.length > 0 ? (
          <div className="space-y-3">
            {tickets.map((t) => (
              <TicketCard
                key={t.id}
                ticket={t}
                onViewDetails={() => navigate(`/tickets/${t.id}`)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
};

export default MyTickets;

