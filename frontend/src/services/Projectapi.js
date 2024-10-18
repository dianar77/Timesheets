import api from './api';

// Project endpoints
export const getProjects = async () => {
    const response = await api.get(`/projects`);
    return response.data;
  };
  
  export const getProjectById = (id) => api.get(`/projects/${id}`);
  
  export const createProject = async (project) => {
    const response = await api.post(`/projects`, project);
    return response.data;
  };
  
  export const updateProject = async (id, project) => {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
  };
  
  export const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  };

  export const getProjectByVessel = async (vesselId) => {
    try {
      const response = await api.get(`/projects/vessel/${vesselId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project by vessel:`, error);
      throw error;
    }
  };

  export const getProjectDropdownList = () => {
    return api.get(`/projects/dropdown/list`);
  };
  