import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const roomService = {
  // Get all rooms with optional filtering
  getRooms: async (filters = {}) => {
    const response = await api.get('/rooms', { params: filters });
    return response.data;
  },

  // Get single room by ID
  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  // Create a new room (admin only)
  createRoom: async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },

  // Update room (admin only)
  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  // Delete room (admin only)
  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },

  // Get room images
  getRoomImages: async (roomId) => {
    const response = await api.get(`/rooms/${roomId}/images`);
    return response.data;
  },

  // Add room image (admin only)
  addRoomImage: async (roomId, imageData) => {
    const response = await api.post(`/rooms/${roomId}/images`, imageData);
    return response.data;
  },

  // Delete room image (admin only)
  deleteRoomImage: async (imageId) => {
    const response = await api.delete(`/images/${imageId}`);
    return response.data;
  },

  // Update room status (admin only)
  updateRoomStatus: async (roomId, status) => {
    const response = await api.patch(`/rooms/${roomId}/status`, { status });
    return response.data;
  },
};

export default api;