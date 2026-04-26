const API_BASE = 'http://localhost:8080/api/v1/bookings';
const ADMIN_API_BASE = 'http://localhost:8080/api/admin/bookings';

const getAuthToken = () => localStorage.getItem('token');
const getAdminToken = () => localStorage.getItem('adminToken');
const getUserId = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).id : null;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw error;
  }
  if (res.status === 204) return null;
  return res.json();
};

export const bookingService = {
  // User operations
  createBooking: async (slotId, startTime, endTime, purpose, expectedAttendees) => {
    return fetch(`${API_BASE}/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'X-User-Id': getUserId(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ slotId, startTime, endTime, purpose, expectedAttendees })
    }).then(handleResponse);
  },

  getUserBookings: async () => {
    return fetch(`${API_BASE}/user`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'X-User-Id': getUserId()
      }
    }).then(handleResponse);
  },

  cancelBooking: async (bookingId) => {
    return fetch(`${API_BASE}/${bookingId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'X-User-Id': getUserId(),
        'Content-Type': 'application/json'
      }
    }).then(handleResponse);
  },

  getUserBookingsByStatus: async (status) => {
    return fetch(`${API_BASE}/user/status/${status}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'X-User-Id': getUserId()
      }
    }).then(handleResponse);
  },

  // Admin operations
  getAllBookings: async (status, zone, dateRange) => {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (zone) query.append('zone', zone);
    if (dateRange) query.append('dateRange', dateRange);
    return fetch(`${ADMIN_API_BASE}?${query.toString()}`, {
      headers: { 'Authorization': `Bearer ${getAdminToken()}` }
    }).then(handleResponse);
  },

  updateBookingStatus: async (bookingId, status, reason) => {
    return fetch(`${ADMIN_API_BASE}/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAdminToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, reason })
    }).then(handleResponse);
  }
};

export default bookingService;
