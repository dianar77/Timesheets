import api from './api';

// Add these functions to the existing api.js file
export const getStaffs = async () => {
    try {
      const response = await api.get(`/staffs`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff:`, error);
      throw error;
    }
  };
  
  export const getStaffById = (id) => api.get(`/staffs/${id}`);
  
  export const createStaff = async (staff) => {
    const response = await api.post(`/staffs`, staff);
    return response.data;
  };
  
  export const updateStaff = async (id, staff) => {
    const response = await api.put(`/staffs/${id}`, staff);
    return response.data;
  };
  
  export const deleteStaff = async (id) => {
    const response = await api.delete(`/staffs/${id}`);
    return response.data;
  };
  
  // Add this new function
  export const getStaffByDiscipline = async (disciplineId) => {
    try {
      const response = await api.get(`/staffs/discipline/${disciplineId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff by discipline:`, error);
      throw error;
    }
  };
  
  export const getStaffsDropdownList = () => {
    return api.get(`/staffs/dropdown/list`);
  };
  