import api from './api';

export const emailService = {
  getSimulatedEmails: async (email) => {
    try {
      const response = await api.get('/simulated-emails', { params: { email } });
      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      console.error('Error in getSimulatedEmails:', err);
      return [];
    }
  }
};

export default emailService;
