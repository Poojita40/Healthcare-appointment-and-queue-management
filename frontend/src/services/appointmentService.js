import api from './api';

export const appointmentService = {
  getAppointments: async (params) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};

export default appointmentService;
