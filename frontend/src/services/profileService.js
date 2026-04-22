const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Mock data for testing when backend is not available
const mockProfile = {
  userId: 'U-001',
  fullName: 'John Doe',
  universityId: 'IT001',
  email: 'john@university.edu',
  phoneNumber: '0711234567',
  faculty: 'computing',
  userType: 'STUDENT',
  avatarUrl: '',
  vehicleType: 'CAR',
  vehicleRegistration: 'ABC-1234',
  vehicleStatus: 'VERIFIED',
  role: 'USER'
};

const mockUserStats = {
  totalBookings: 12,
  ticketsSubmitted: 3
};

const mockFaculties = [
  { value: 'computing', label: 'Faculty of Computing' },
  { value: 'engineering', label: 'Faculty of Engineering' },
  { value: 'business', label: 'Faculty of Business' },
  { value: 'science', label: 'Faculty of Science' },
  { value: 'humanities', label: 'Faculty of Humanities' }
];

export const profileService = {
  // Get current user profile
  getCurrentProfile: async () => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: getAuthHeader(),
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch profile');
    } catch (error) {
      console.warn('⚠️ Backend unavailable, using mock data for profile');
      // Merge with actual user data from localStorage if available
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return { ...mockProfile, ...JSON.parse(storedUser) };
      }
      return mockProfile;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(profileData),
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to update profile');
    } catch (error) {
      console.warn('⚠️ Backend unavailable, updating localStorage instead');
      // Update localStorage with the profile data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updated = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      }
      return profileData;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await fetch(`${API_URL}/users/me/stats`, {
        method: 'GET',
        headers: getAuthHeader(),
      });
      if (response.ok) {
        return await response.json();
      }
      return mockUserStats;
    } catch (error) {
      console.warn('⚠️ Backend unavailable, using mock data for user stats');
      return mockUserStats;
    }
  },

  // Get available faculties
  getFaculties: async () => {
    try {
      const response = await fetch(`${API_URL}/faculties`, {
        method: 'GET',
        headers: getAuthHeader(),
      });
      if (response.ok) {
        return await response.json();
      }
      return mockFaculties;
    } catch (error) {
      console.warn('⚠️ Backend unavailable, using mock data for faculties');
      return mockFaculties;
    }
  },
};
