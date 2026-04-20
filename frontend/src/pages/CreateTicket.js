import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import Button from '../components/Button';
import { ticketService } from '../services/ticketService';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const CreateTicket = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    tag: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await ticketService.create({
        title: form.title,
        description: form.description,
        priority: form.priority,
        tag: form.tag || null,
      });
      navigate('/my-tickets');
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Create Ticket">
      <form onSubmit={onSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
        ) : null}

        <label className="block text-sm font-semibold text-gray-800">Title</label>
        <input
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="Short summary"
          required
          maxLength={120}
        />

        <label className="mt-4 block text-sm font-semibold text-gray-800">Description</label>
        <textarea
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          name="description"
          value={form.description}
          onChange={onChange}
          rows={5}
          placeholder="Describe the issue..."
          required
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
            <label className="block text-sm font-semibold text-gray-800">Tag (optional)</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              name="tag"
              value={form.tag}
              onChange={onChange}
              placeholder="maintenance / incident"
              maxLength={60}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={loading}>Create</Button>
        </div>
      </form>
    </AppLayout>
  );
};

export default CreateTicket;

