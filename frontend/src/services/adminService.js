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

  updateUserRoles: async (userId, roles) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/roles`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify(roles),
    });
    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || 'Failed to update user roles');
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
};
