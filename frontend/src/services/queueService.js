import api from './api';

export const queueService = {
  getQueueStatus: async () => {
    const response = await api.get('/queue');
    return response.data;
  },

  callNext: async (doctorId) => {
    const response = await api.put('/queue/next', { doctorId });
    return response.data;
  },

  skipToken: async (doctorId, tokenNumber) => {
    const response = await api.put('/queue/skip', { doctorId, tokenNumber });
    return response.data;
  },

  completeToken: async (doctorId, tokenNumber) => {
    const response = await api.put('/queue/complete', { doctorId, tokenNumber });
    return response.data;
  }
};

export default queueService;
