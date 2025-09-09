import apiClient from './client';

export const fineApi = {
  getFines: async (userId) => {
    const response = await apiClient.get(`/fines/user/${userId}`);
    return response.data;
  },

  payFine: async (fineId) => {
    const response = await apiClient.post(`/fines/pay/${fineId}`);
    return response.data;
  }
};