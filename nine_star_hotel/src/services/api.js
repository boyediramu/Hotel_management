import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (future implementation)
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/admins/login', credentials);
    return response.data;
  },
  
  getAdmins: async () => {
    const response = await api.get('/admins');
    return response.data;
  }
};

// Room management API calls
export const roomAPI = {
  getAllRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },
  
  createRoom: async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },
  
  updateRoom: async (roomId, roomData) => {
    const response = await api.put(`/rooms/${roomId}`, roomData);
    return response.data;
  },
  
  deleteRoom: async (roomId) => {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  },
  
  updateRoomStatus: async (roomId, status) => {
    const response = await api.put(`/rooms/${roomId}/status`, { status });
    return response.data;
  }
};

// Guest management API calls
export const guestAPI = {
  getAllGuests: async () => {
    const response = await api.get('/guests');
    return response.data;
  },
  
  checkinGuest: async (guestData) => {
    const response = await api.post('/guests/checkin', guestData);
    return response.data;
  },
  
  checkoutGuest: async (guestId) => {
    const response = await api.post(`/guests/${guestId}/checkout`);
    return response.data;
  },
  
  updateGuest: async (guestId, guestData) => {
    const response = await api.put(`/guests/${guestId}`, guestData);
    return response.data;
  },
  
  getBookingHistory: async () => {
    const response = await api.get('/guests/history');
    return response.data;
  }
};

// Health check API call
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

// Generic API utility functions
export const apiUtils = {
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return error.response.data?.message || 'Server error occurred';
    } else if (error.request) {
      // Request was made but no response received
      return 'Network error. Please check your connection.';
    } else {
      // Something else happened
      return 'An unexpected error occurred';
    }
  },
  
  isNetworkError: (error) => {
    return !error.response && error.request;
  },
  
  isServerError: (error) => {
    return error.response && error.response.status >= 500;
  },
  
  isClientError: (error) => {
    return error.response && error.response.status >= 400 && error.response.status < 500;
  }
};

export default api;
