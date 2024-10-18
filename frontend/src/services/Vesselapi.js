import api from './api';

// Vessel endpoints
export const getVessels = async () => {
    const response = await api.get(`/vessels`);
    return response.data;
  };
  
  export const getVesselById = (id) => api.get(`/vessels/${id}`);
  
  export const createVessel = async (vesselData) => {
    const response = await api.post(`/vessels`, vesselData);
    return response.data;
  };
  
  export const updateVessel = async (id, vesselData) => {
    const response = await api.put(`/vessels/${id}`, vesselData);
    return response.data;
  };
  
  export const deleteVessel = async (id) => {
    const response = await api.delete(`/vessels/${id}`);
    return response.data;
  };

  export const getVesselByClient = async (clientId) => {
    try {
      const response = await api.get(`/vessels/client/${clientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vessel by client:`, error);
      throw error;
    }
  };

  export const getVesselDropdownList = () => {
    return api.get(`/vessels/dropdown/list`);
  };
  
  
  