import api from './api';

export const hoursService = {
  logHours: async (data) => {
    const response = await api.post('/hours/log', data);
    return response.data;
  },

  getMyHours: async () => {
    const response = await api.get('/hours/my-hours');
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/hours/summary');
    return response.data;
  },

  deleteHours: async (id) => {
    const response = await api.delete(`/hours/${id}`);
    return response.data;
  }
};
