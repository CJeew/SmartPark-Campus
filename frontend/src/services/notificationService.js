const API_URL = 'http://localhost:8080/api/notifications';

const getAuthToken = () => localStorage.getItem('token');
const getUserId = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).id : null;
};

const authHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'X-User-Id': getUserId(),
  'Content-Type': 'application/json',
});

export const notificationService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  getUnreadCount: async () => {
    const res = await fetch(`${API_URL}/unread-count`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch unread count');
    return res.json();
  },

  markAsRead: async (id) => {
    const res = await fetch(`${API_URL}/${id}/read`, {
      method: 'PUT',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to mark as read');
  },

  markAllAsRead: async () => {
    const res = await fetch(`${API_URL}/read-all`, {
      method: 'PUT',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to mark all as read');
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete notification');
  },
};
