const API_URL = 'http://localhost:8080/api/v1/tickets';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  return {
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const ticketService = {
  createTicket: async (ticketData, images) => {
    const formData = new FormData();
    
    Object.keys(ticketData).forEach(key => {
      if (ticketData[key] !== undefined && ticketData[key] !== null && ticketData[key] !== '') {
        formData.append(key, ticketData[key]);
      }
    });
    
    // Append images (up to 3 as requested, Multer/MultipartFile equivalent)
    if (images && images.length > 0) {
      const maxImages = Math.min(images.length, 3);
      for (let i = 0; i < maxImages; i++) {
        formData.append('images', images[i]);
      }
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeader(), // Browser sets multipart/form-data with boundary
      body: formData,
    });

    if (!response.ok) {
      let errorMsg = 'Failed to create ticket';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorMsg = await response.text();
      }
      console.error('Backend Error Response:', errorMsg);
      throw new Error(errorMsg);
    }
    
    return await response.json();
  },

  getMyTickets: async (limit = 50) => {
    const response = await fetch(`${API_URL}/my?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      let errorMsg = 'Failed to fetch tickets';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorMsg = await response.text();
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  },

  getTicketById: async (ticketId) => {
    const response = await fetch(`${API_URL}/${ticketId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      let errorMsg = 'Failed to fetch ticket';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorMsg = await response.text();
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  },

  getAllTickets: async () => {
    const response = await fetch(`${API_URL}/admin/all`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch all tickets');
    return await response.json();
  },

  getTechnicians: async () => {
    const response = await fetch(`${API_URL}/admin/technicians`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch technicians');
    return await response.json();
  },

  assignTechnician: async (ticketId, technicianId) => {
    const url = technicianId
      ? `${API_URL}/admin/${ticketId}/assign?technicianId=${technicianId}`
      : `${API_URL}/admin/${ticketId}/assign`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      let errorMsg = 'Failed to assign technician';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorMsg = await response.text();
      }
      throw new Error(errorMsg);
    }
    return await response.json();
  },

  getMyAssignedTickets: async () => {
    const response = await fetch(`${API_URL}/my-assigned`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      let errorMsg = 'Failed to fetch assigned tickets';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || JSON.stringify(errorData);
      } catch (_) {
        // body already consumed or not JSON — use generic message
      }
      throw new Error(errorMsg);
    }
    return await response.json();
  },

  addReply: async (ticketId, message) => {
    const response = await fetch(`${API_URL}/${ticketId}/replies`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      let errorMsg = 'Failed to add reply';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorMsg = await response.text();
      }
      throw new Error(errorMsg);
    }
    return await response.json();
  },
};
