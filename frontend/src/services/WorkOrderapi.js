import api from './api';
// Work Order endpoints
export const getWorkOrders = async () => {
    const response = await api.get('/workorders');
    return response.data;
  };
  
  export const getWorkOrderById = (id) => api.get('/workorders/${id}');
  
  export const createWorkOrder = async (workOrder) => {
    const response = await api.post('/workorders', workOrder);
    return response.data;
  };
  
  export const updateWorkOrder = async (id, workOrder) => {
    const response = await api.put('/workorders/${id}', workOrder);
    return response.data;
  };
  
  export const deleteWorkOrder = async (id) => {
    const response = await api.delete('/workorders/${id}');
    return response.data;
  };


  export const getWorkOrderByVessel = async (vesselId) => {
    try {
      const response = await api.get('/workorders/vessel/${vesselId}');
      return response.data;
    } catch (error) {
      console.error('Error fetching work order by vessel:', error);
      throw error;
    }
  };
  export const getWorkOrderDropdownList = () => {
    return api.get('/workorders/dropdown/list');
  };
  