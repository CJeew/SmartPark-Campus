const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Mock data for testing when backend is not available
const mockDashboardStats = {
  totalBookings: 12,
  activeBooking: 1,
  openTickets: 3,
  resolvedTickets: 8
};

const mockActiveBooking = {
  bookingId: 'BK-001',
  slotNumber: 'A-12',
  zoneName: 'Zone A',
  vehicleType: 'CAR',
  date: '2026-04-20',
  startTime: '09:00',
  endTime: '17:00',
  status: 'APPROVED'
};

const mockRecentTickets = [
  {
    ticketId: 'TK-001',
    title: 'Pothole in Zone B',
    category: 'Infrastructure',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    location: 'Zone B',
    createdAt: '2026-04-18'
  },
  {
    ticketId: 'TK-002',
    title: 'Broken lighting',
    category: 'Electrical',
    priority: 'MEDIUM',
    status: 'OPEN',
    location: 'Zone C',
    createdAt: '2026-04-17'
  },
  {
    ticketId: 'TK-003',
    title: 'Suspicious vehicle',
    category: 'Security',
    priority: 'CRITICAL',
    status: 'RESOLVED',
    location: 'Zone A',
    createdAt: '2026-04-16'
  }
];

const mockNotifications = [
  {
    notificationId: 'N-001',
    message: 'Your booking has been approved',
    type: 'BOOKING_APPROVED',
    isRead: false,
    createdAt: '2026-04-19T10:30:00Z'
  },
  {
    notificationId: 'N-002',
    message: 'Your ticket #TK-001 is now in progress',
    type: 'TICKET_UPDATED',
    isRead: false,
    createdAt: '2026-04-18T14:15:00Z'
  },
  {
    notificationId: 'N-003',
    message: 'New comment on your ticket #TK-003',
    type: 'COMMENT_ADDED',
    isRead: true,
    createdAt: '2026-04-17T09:45:00Z'
  }
];

export const dashboardService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/stats`, {
        method: 'GET',
        headers: getAuthHeader(),
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch dashboard stats');
    } catch (error) {
      console.warn('⚠️ Backend unavailable, using mock data for dashboard stats');
      return mockDashboardStats;
    }
  },

  // Get user's active/upcoming booking
  getActiveBooking: async () => {
    try {
      const response = await fetch(`${API_URL}/bookings/active`, {
        method: 'GET',
        headers: getAuthHeader(),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.warn('⚠️ Backend unavailable, using mock data for active booking');
      return mockActiveBooking;
    }
  },

  // Get user's recent tickets
  getRecentTickets: async (limit = 3) => {
    try {
      const response = await fetch(`${API_URL}/tickets/my?limit=${limit}`, {
        method: 'GET',
        headers: getAuthHeader(),
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.warn('⚠️ Backend unavailable, using mock data for tickets');
      return mockRecentTickets.slice(0, limit);
    }
  },

  // Get user's recent notifications
  getRecentNotifications: async (limit = 3) => {
    try {
      const response = await fetch(`${API_URL}/notifications?limit=${limit}`, {
        method: 'GET',
        headers: getAuthHeader(),
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.warn('⚠️ Backend unavailable, using mock data for notifications');
      return mockNotifications.slice(0, limit);
    }
  },
};
