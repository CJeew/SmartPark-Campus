import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import Button from '../components/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import StatusBadge from '../components/tickets/StatusBadge';
import PriorityBadge from '../components/tickets/PriorityBadge';
import TagBadge from '../components/tickets/TagBadge';
import { ticketService } from '../services/ticketService';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await ticketService.getById(ticketId);
        if (!cancelled) {
          setTicket(data);
          setForm({
            title: data.title || '',
            description: data.description || '',
            priority: data.priority || 'MEDIUM',
            tag: data.tag || '',
          });
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load ticket');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [ticketId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    if (!form) return;
    setSaving(true);
    setError('');
    try {
      const updated = await ticketService.update(ticketId, {
        title: form.title,
        description: form.description,
        priority: form.priority,
        tag: form.tag || null,
      });
      setTicket(updated);
      setForm({
        title: updated.title || '',
        description: updated.description || '',
        priority: updated.priority || 'MEDIUM',
        tag: updated.tag || '',
      });
    } catch (e) {
      setError(e?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this ticket?')) return;
    setSaving(true);
    setError('');
    try {
      await ticketService.remove(ticketId);
      navigate('/my-tickets');
    } catch (e) {
      setError(e?.message || 'Failed to delete ticket');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout
      title="Ticket Details"
      actions={<Button variant="secondary" onClick={() => navigate('/my-tickets')}>Back</Button>}
    >
      {loading ? <LoadingSkeleton rows={2} /> : null}

      {!loading && error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
      ) : null}

      {!loading && ticket && form ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <TagBadge tag={ticket.tag} />
          </div>

          <label className="mt-5 block text-sm font-semibold text-gray-800">Title</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            name="title"
            value={form.title}
            onChange={onChange}
            maxLength={120}
          />

          <label className="mt-4 block text-sm font-semibold text-gray-800">Description</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            name="description"
            value={form.description}
            onChange={onChange}
            rows={6}
            maxLength={2000}
          />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-800">Priority</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                name="priority"
                value={form.priority}
                onChange={onChange}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800">Tag</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                name="tag"
                value={form.tag}
                onChange={onChange}
                maxLength={60}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={onSave} loading={saving} disabled={saving}>Save</Button>
            <Button variant="danger" onClick={onDelete} disabled={saving}>Delete</Button>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
};

export default TicketDetails;

