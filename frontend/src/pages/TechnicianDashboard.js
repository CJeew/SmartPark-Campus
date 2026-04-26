import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { ticketService } from '../services/ticketService';

// ── Helpers ──────────────────────────────────────────────────────────────────
const priorityColors = {
  CRITICAL: { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',       ring: 'border-l-red-500' },
  HIGH:     { dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', ring: 'border-l-orange-500' },
  MEDIUM:   { dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700', ring: 'border-l-yellow-500' },
  LOW:      { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',   ring: 'border-l-green-500' },
};

const statusColors = {
  OPEN:        'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED:    'bg-green-100 text-green-700',
  CLOSED:      'bg-gray-100 text-gray-500',
};

const statusLabel = (s) =>
  s === 'IN_PROGRESS' ? 'In Progress' : s ? s.charAt(0) + s.slice(1).toLowerCase() : '—';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Sk = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, title, value, color, loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{title}</p>
      {loading
        ? <Sk className="h-8 w-12 mt-1" />
        : <p className="text-3xl font-bold text-gray-800 leading-tight">{value}</p>
      }
    </div>
  </div>
);

// ── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ ticket, onClose }) => {
  if (!ticket) return null;
  const pc = priorityColors[ticket.priority] || priorityColors.LOW;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-auto my-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {ticket.ticketId && (
                <span className="text-xs font-mono text-gray-400">{ticket.ticketId}</span>
              )}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pc.badge}`}>
                {ticket.priority}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[ticket.status] || 'bg-gray-100 text-gray-600'}`}>
                {statusLabel(ticket.status)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 leading-snug">{ticket.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Category',      value: ticket.category },
              { label: 'Location',      value: ticket.location },
              { label: 'Resource Type', value: ticket.resourceType || '—' },
              { label: 'Resource ID',   value: ticket.resourceId   || '—' },
              {
                label: 'Submitted',
                value: ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : '—',
              },
              { label: 'Contact Method', value: ticket.preferredContactMethod || '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm text-gray-700 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Reporter contact */}
          {(ticket.preferredContactName || ticket.preferredContactEmail || ticket.preferredContactPhone) && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Reporter Contact</p>
              <div className="space-y-1">
                {ticket.preferredContactName  && <p className="text-sm text-gray-700">{ticket.preferredContactName}</p>}
                {ticket.preferredContactEmail && <p className="text-sm text-blue-600">{ticket.preferredContactEmail}</p>}
                {ticket.preferredContactPhone && <p className="text-sm text-gray-700">{ticket.preferredContactPhone}</p>}
              </div>
            </div>
          )}

          {/* Attachments count */}
          {ticket.attachments?.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-indigo-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {ticket.attachments.length} attachment{ticket.attachments.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const TechnicianDashboard = () => {
  const [tickets, setTickets]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [selected, setSelected]     = useState(null);
  const [statusFilter, setStatus]   = useState('ALL');
  const [search, setSearch]         = useState('');

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ticketService.getMyAssignedTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load assigned tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Derived stats
  const counts = {
    total:      tickets.length,
    open:       tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved:   tickets.filter(t => t.status === 'RESOLVED').length,
  };

  // Filtered list
  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || t.title?.toLowerCase().includes(q)
      || t.ticketId?.toLowerCase().includes(q)
      || t.location?.toLowerCase().includes(q)
      || t.category?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar pendingBookings={0} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Assigned Tickets</h2>
            <p className="text-xs text-gray-400 mt-0.5">{today}</p>
          </div>
          <button
            onClick={loadTickets}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </header>

        <div className="px-8 py-6 space-y-6">

          {/* Error banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              loading={loading}
              title="Total Assigned"
              value={counts.total}
              color="bg-indigo-50"
              icon={<svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            />
            <StatCard
              loading={loading}
              title="Open"
              value={counts.open}
              color="bg-blue-50"
              icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              loading={loading}
              title="In Progress"
              value={counts.inProgress}
              color="bg-yellow-50"
              icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <StatCard
              loading={loading}
              title="Resolved"
              value={counts.resolved}
              color="bg-green-50"
              icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>

          {/* Tickets panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Panel header with filters */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Assigned Tickets</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {loading ? 'Loading…' : `${filtered.length} of ${tickets.length} tickets`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status filter tabs */}
                <div className="flex items-center gap-0.5 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                  {['ALL', ...STATUSES].map(s => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        statusFilter === s
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-white'
                      }`}
                    >
                      {s === 'ALL' ? 'All' : statusLabel(s)}
                    </button>
                  ))}
                </div>
                {/* Search */}
                <div className="relative">
                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search tickets…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-40"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Sk className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Sk className="h-3.5 w-48" />
                      <Sk className="h-3 w-64" />
                    </div>
                    <Sk className="h-6 w-20 rounded-full" />
                    <Sk className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-700 mb-1">
                  {tickets.length === 0 ? 'No Tickets Assigned Yet' : 'No Matching Tickets'}
                </p>
                <p className="text-sm text-gray-400">
                  {tickets.length === 0
                    ? 'When an admin assigns a ticket to you, it will appear here.'
                    : 'Try adjusting your filters or search term.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map(ticket => {
                  const pc = priorityColors[ticket.priority] || priorityColors.LOW;
                  return (
                    <div
                      key={ticket.id}
                      className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50/70 transition-colors border-l-4 ${pc.ring}`}
                    >
                      {/* Priority dot */}
                      <span className={`block w-2.5 h-2.5 rounded-full flex-shrink-0 ${pc.dot}`} />

                      {/* Title + ID */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{ticket.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {ticket.ticketId && (
                            <span className="text-xs text-gray-400 font-mono">{ticket.ticketId}</span>
                          )}
                          {ticket.category && (
                            <span className="text-xs text-gray-400">· {ticket.category}</span>
                          )}
                          {ticket.location && (
                            <span className="text-xs text-gray-400">· {ticket.location}</span>
                          )}
                        </div>
                      </div>

                      {/* Priority badge */}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${pc.badge}`}>
                        {ticket.priority}
                      </span>

                      {/* Status badge */}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${statusColors[ticket.status] || 'bg-gray-100 text-gray-500'}`}>
                        {statusLabel(ticket.status)}
                      </span>

                      {/* Date */}
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 hidden sm:block">
                        {ticket.createdAt
                          ? new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </span>

                      {/* View button */}
                      <button
                        onClick={() => setSelected(ticket)}
                        className="px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex-shrink-0"
                      >
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail modal */}
      {selected && (
        <DetailModal ticket={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default TechnicianDashboard;
