import apiClient from './client';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  googleLogin: async (code) => {
    const response = await apiClient.post('/auth/google/callback', { code });
    return response.data;
  },

  getGoogleAuthUrl: () => {
    return `${import.meta.env.VITE_API_URL}/auth/google/url`;
  }
};