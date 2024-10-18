import api from './api';

// Client endpoints
export const getClients = async () => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  };
  
  export const getClientById = (id) => api.get('/clients/${id}');
  
  export const createClient = async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  };
  
  export const updateClient = async (id, clientData) => {
    const response = await api.put('/clients/${id}', clientData);
    return response.data;
  };
  
  export const deleteClient = async (id) => {
    const response = await api.delete('/clients/${id}');
    return response.data;
  };

  export const getClientDropdownList = () => {
    return api.get('/clients/dropdown/list');
  };
  