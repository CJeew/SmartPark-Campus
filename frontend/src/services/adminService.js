const API_URL = 'http://localhost:8080/api';

const authHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json',
});

export const adminService = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_URL}/admin/stats`, { headers: authHeader() });
    if (!response.ok) throw new Error('Unauthorized');
    return response.json();
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/admin/users`, { headers: authHeader() });
    if (!response.ok) throw new Error('Unauthorized');
    return response.json();
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  getAdmin: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn: () => !!localStorage.getItem('adminToken'),

  getBookings: async (status, zone, dateRange) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (zone && zone !== 'all') params.append('zone', zone);
    if (dateRange && dateRange !== 'all') params.append('dateRange', dateRange);
    const response = await fetch(`${API_URL}/admin/bookings?${params}`, { headers: authHeader() });
    if (!response.ok) throw new Error('Unauthorized');
    return response.json();
  },

  toggleUserStatus: async (userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: authHeader(),
    });
    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || 'Failed to update user status');
    }
    return response.json();
  },

  updateBookingStatus: async (bookingId, status, reason) => {
    const response = await fetch(`${API_URL}/admin/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify({ status, reason }),
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
  },

  getHelmetRackOverview: async () => {
    const response = await fetch(`${API_URL}/admin/helmet-rack/overview`, { headers: authHeader() });
    if (!response.ok) throw new Error('Failed to load helmet rack overview');
    return response.json();
  },

  getHelmetRackActivities: async (query = '') => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    const response = await fetch(`${API_URL}/admin/helmet-rack/activities?${params}`, { headers: authHeader() });
    if (!response.ok) throw new Error('Failed to load helmet activities');
    return response.json();
  },

  helmetCheckIn: async (slotId, payload) => {
    const response = await fetch(`${API_URL}/admin/helmet-rack/slots/${slotId}/check-in`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to check in helmet');
    return response.json();
  },

  helmetCheckOut: async (slotId, payload) => {
    const response = await fetch(`${API_URL}/admin/helmet-rack/slots/${slotId}/check-out`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to check out helmet');
    return response.json();
  },

  helmetFlag: async (slotId, payload) => {
    const response = await fetch(`${API_URL}/admin/helmet-rack/slots/${slotId}/flag`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to flag slot');
    return response.json();
  },

  helmetUnflag: async (slotId) => {
    const response = await fetch(`${API_URL}/admin/helmet-rack/slots/${slotId}/unflag`, {
      method: 'POST',
      headers: authHeader(),
    });
    if (!response.ok) throw new Error('Failed to unflag slot');
    return response.json();
  },
};
