import api from './api';

export const patientService = {
  getPatients: async () => {
    const response = await api.get('/patients');
    return response.data;
  }
};

export default patientService;
