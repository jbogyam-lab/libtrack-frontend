import apiClient from './client';

export const bookApi = {
  getAllBooks: async () => {
    const response = await apiClient.get('/books');
    return response.data;
  },

  getBookById: async (id) => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },

  addBook: async (bookData) => {
    const response = await apiClient.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  }
};