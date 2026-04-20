const API_URL = 'http://localhost:8080/api/admin/tickets';

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

  const message = body?.message || body?.error || 'Request failed';
  const error = new Error(message);
  error.status = response.status;
  throw error;
}

export const adminTicketService = {
  listTickets: (status) => {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return request(`${qs}`, { method: 'GET' });
  },
  getById: (ticketId) => request(`/${encodeURIComponent(ticketId)}`, { method: 'GET' }),
  updateStatus: (ticketId, status) =>
    request(`/${encodeURIComponent(ticketId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),
};

