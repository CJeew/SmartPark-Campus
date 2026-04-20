const API_URL = 'http://localhost:8080/api/tickets';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (response.status === 204) return null;
  if (contentType.includes('application/json')) return response.json();
  return response.text();
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  const body = await parseResponse(response);
  if (response.ok) return body;

  const message = body?.message || body?.error || body?.message || 'Request failed';
  const error = new Error(message);
  error.status = response.status;
  throw error;
}

export const ticketService = {
  listMyTickets: (status) => {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return request(`/my${qs}`, { method: 'GET' });
  },
  create: (payload) =>
    request('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getById: (ticketId) => request(`/${encodeURIComponent(ticketId)}`, { method: 'GET' }),
  update: (ticketId, patch) =>
    request(`/${encodeURIComponent(ticketId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }),
  remove: (ticketId) => request(`/${encodeURIComponent(ticketId)}`, { method: 'DELETE' }),
};

