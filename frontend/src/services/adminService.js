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
};
