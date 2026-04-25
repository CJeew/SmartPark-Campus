import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { ticketService } from '../services/ticketService';

const API = 'http://localhost:8080/api/v1/tickets';

const getAdminHeader = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
};

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const priorityColors = {
  CRITICAL: { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700' },
  HIGH:     { dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700' },
  MEDIUM:   { dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700' },
  LOW:      { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700' },
};
const statusColors = {
  OPEN:        'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED:    'bg-green-100 text-green-700',
  CLOSED:      'bg-gray-100 text-gray-500',
};
const statusLabel = (s) => s === 'IN_PROGRESS' ? 'In Progress' : s?.charAt(0) + s?.slice(1).toLowerCase();

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Sk = ({ className }) => <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;

// ── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ ticket, onClose, onStatusChange, updating, onAssign, technicians, assigning }) => {
  const [lightbox, setLightbox] = useState(null);
  if (!ticket) return null;
  const pc = priorityColors[ticket.priority] || priorityColors.LOW;
  const hasImages = ticket.attachments?.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto my-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {ticket.ticketId && <span className="text-xs font-mono text-gray-400">{ticket.ticketId}</span>}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pc.badge}`}>{ticket.priority}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[ticket.status] || 'bg-gray-100 text-gray-600'}`}>
                {statusLabel(ticket.status)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 leading-snug">{ticket.title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Category',      value: ticket.category },
              { label: 'Location',      value: ticket.location },
              { label: 'Resource Type', value: ticket.resourceType || '—' },
              { label: 'Resource ID',   value: ticket.resourceId   || '—' },
              { label: 'Submitted',     value: ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
              { label: 'Contact',       value: ticket.preferredContactMethod || '—' },
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

          {/* Contact */}
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

          {/* Images */}
          {hasImages ? (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Attachments ({ticket.attachments.length})
              </p>
              <div className="grid grid-cols-3 gap-3">
                {ticket.attachments.map((att) => {
                  const src = att.imageDataUrl || (att.imageData ? `data:${att.contentType || 'image/jpeg'};base64,${att.imageData}` : null);
                  return (
                    <div key={att.id}
                      className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => src && setLightbox(src)}
                    >
                      {src ? (
                        <>
                          <img src={src} alt={att.fileName} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                            </svg>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs truncate">{att.fileName}</p>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-2">
                          <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-center truncate w-full">{att.fileName}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No attachments on this ticket.</p>
          )}

          {/* Assign Technician */}
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Assign Technician</p>
            {ticket.assignedTechnicianName && (
              <p className="text-xs text-purple-700 font-medium mb-2">
                Currently: {ticket.assignedTechnicianName}
              </p>
            )}
            <div className="flex items-center gap-2">
              <select
                defaultValue={ticket.assignedTechnicianId || ''}
                id="tech-select"
                className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
              >
                <option value="">— Unassign —</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.fullName} ({t.email})</option>
                ))}
              </select>
              <button
                disabled={assigning}
                onClick={() => {
                  const sel = document.getElementById('tech-select');
                  const val = sel.value ? Number(sel.value) : null;
                  onAssign(ticket.id, val);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {assigning ? 'Saving…' : 'Assign'}
              </button>
            </div>
          </div>

          {/* Status update */}
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={ticket.status === s || updating}
                  onClick={() => onStatusChange(ticket.id, s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    ticket.status === s
                      ? 'bg-indigo-600 text-white shadow-sm cursor-default'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50'
                  }`}
                >
                  {updating === s ? '…' : statusLabel(s)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Close
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white" onClick={() => setLightbox(null)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={lightbox} alt="Attachment" className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const AdminTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [search, setSearch]             = useState('');
  const [selected, setSelected]         = useState(null);
  const [updating, setUpdating]         = useState(null);
  const [toast, setToast]               = useState(null);
  const [technicians, setTechnicians]   = useState([]);
  const [assigning, setAssigning]       = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/all`, { headers: getAdminHeader() });
      if (!res.ok) throw new Error('Failed to load tickets');
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  useEffect(() => {
    ticketService.getTechnicians()
      .then(setTechnicians)
      .catch(() => setTechnicians([]));
  }, []);

  const handleAssign = async (ticketId, technicianId) => {
    setAssigning(true);
    try {
      const updated = await ticketService.assignTechnician(ticketId, technicianId);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedTechnicianId: updated.assignedTechnicianId, assignedTechnicianName: updated.assignedTechnicianName } : t));
      setSelected(prev => prev?.id === ticketId ? { ...prev, assignedTechnicianId: updated.assignedTechnicianId, assignedTechnicianName: updated.assignedTechnicianName } : prev);
      showToast(technicianId ? `Assigned to ${updated.assignedTechnicianName}` : 'Technician unassigned');
    } catch (e) {
      showToast('Failed to assign technician', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdating(newStatus);
    try {
      const res = await fetch(`${API}/admin/${ticketId}/status?status=${newStatus}`, {
        method: 'PATCH',
        headers: getAdminHeader(),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: updated.status } : t));
      setSelected(prev => prev?.id === ticketId ? { ...prev, status: updated.status } : prev);
      showToast(`Status updated to ${statusLabel(newStatus)}`);
    } catch (e) {
      showToast('Failed to update status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  // Derived filtered list
  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.title?.toLowerCase().includes(q) || t.ticketId?.toLowerCase().includes(q) || t.location?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q);
    const matchStatus   = statusFilter   === 'ALL' || t.status   === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const counts = {
    total: tickets.length,
    open:  tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">All Tickets</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage all campus incident reports</p>
          </div>
          <button onClick={fetchTickets} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </header>

        <div className="px-8 py-6 space-y-5">
          {/* Stat chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total',       value: counts.total,      color: 'bg-gray-100 text-gray-700' },
              { label: 'Open',        value: counts.open,       color: 'bg-blue-100 text-blue-700' },
              { label: 'In Progress', value: counts.inProgress, color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Resolved',    value: counts.resolved,   color: 'bg-green-100 text-green-700' },
            ].map(({ label, value, color }) => (
              <span key={label} className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
                {label}: {loading ? '…' : value}
              </span>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-sm text-red-700">{error}</div>
          )}

          {/* Filters + search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Incident Tickets</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {loading ? 'Loading…' : `${filtered.length} of ${tickets.length} tickets`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status filter */}
                <div className="flex items-center gap-0.5 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                  {['ALL', ...STATUSES].map(s => (
                    <button key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        statusFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-white'
                      }`}
                    >
                      {s === 'ALL' ? 'All' : statusLabel(s)}
                    </button>
                  ))}
                </div>
                {/* Priority filter */}
                <select
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  <option value="ALL">All Priorities</option>
                  {['CRITICAL','HIGH','MEDIUM','LOW'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {/* Search */}
                <div className="relative">
                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search tickets…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 w-44"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
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
              <div className="px-6 py-14 text-center">
                <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-700 mb-1">No Tickets Found</p>
                <p className="text-sm text-gray-400">No tickets match the current filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 w-6"></th>
                      <th className="px-4 py-3">Ticket</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Technician</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Images</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(ticket => {
                      const pc = priorityColors[ticket.priority] || priorityColors.LOW;
                      return (
                        <tr key={ticket.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-4 py-3">
                            <span className={`block w-2.5 h-2.5 rounded-full mx-auto ${pc.dot}`} />
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-800 truncate max-w-[200px]">{ticket.title}</p>
                            {ticket.ticketId && <p className="text-xs text-gray-400 font-mono">{ticket.ticketId}</p>}
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{ticket.category}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs max-w-[120px] truncate">{ticket.location}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pc.badge}`}>{ticket.priority}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[ticket.status] || 'bg-gray-100 text-gray-500'}`}>
                              {statusLabel(ticket.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {ticket.assignedTechnicianName
                              ? <span className="flex items-center gap-1 text-purple-700 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>{ticket.assignedTechnicianName}</span>
                              : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {ticket.attachments?.length > 0 ? (
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                                </svg>
                                {ticket.attachments.length}
                              </span>
                            ) : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelected(ticket)}
                              className="px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail modal */}
      {selected && (
        <DetailModal
          ticket={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
          onAssign={handleAssign}
          technicians={technicians}
          assigning={assigning}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
