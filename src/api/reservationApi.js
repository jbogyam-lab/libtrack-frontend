import apiClient from './client';

export const reservationApi = {
  create: async (userId, bookId) => {
    const response = await apiClient.post(`/reservations/create?userId=${userId}&bookId=${bookId}`);
    return response.data;
  },

  borrow: async (reservationId) => {
    const response = await apiClient.post(`/reservations/borrow/${reservationId}`);
    return response.data;
  },

  return: async (reservationId) => {
    const response = await apiClient.post(`/reservations/return/${reservationId}`);
    return response.data;
  },

  getUserReservations: async (userId) => {
    const response = await apiClient.get(`/reservations/user/${userId}`);
    return response.data;
  }
};