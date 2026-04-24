const BASE = 'http://localhost:8080/api/v1/parking-zones';

const authHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json',
});

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const error = new Error(err.message || 'Request failed');
    error.status = res.status;
    throw error;
  }
  if (res.status === 204) return null;
  return res.json();
};

export const parkingZoneService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v != null && v !== '') query.append(k, v); });
    return fetch(`${BASE}?${query}`, { headers: authHeader() }).then(handleResponse);
  },

  getById: (id) =>
    fetch(`${BASE}/${id}`, { headers: authHeader() }).then(handleResponse),

  create: (data) =>
    fetch(BASE, { method: 'POST', headers: authHeader(), body: JSON.stringify(data) }).then(handleResponse),

  update: (id, data) =>
    fetch(`${BASE}/${id}`, { method: 'PUT', headers: authHeader(), body: JSON.stringify(data) }).then(handleResponse),

  updateStatus: (id, status) =>
    fetch(`${BASE}/${id}/status`, { method: 'PATCH', headers: authHeader(), body: JSON.stringify({ status }) }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeader() }).then(handleResponse),
};
