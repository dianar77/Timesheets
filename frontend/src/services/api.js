import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Timesheet endpoints
export const getTimesheets = async () => {
  try {
    console.log('Fetching timesheets from:', `${API_URL}/timesheets`);
    const response = await api.get('/timesheets');
    console.log('Timesheet data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    throw error;
  }
};

export const getTimesheetById = (id) => api.get(`/timesheets/${id}`);
export const createTimesheet = (data) => api.post('/timesheets', data);
export const updateTimesheet = async (id, timesheetData) => {
  try {
    console.log('Sending update request for timesheet:', id, timesheetData);
    const response = await axios.put(`${API_URL}/timesheets/${id}`, timesheetData);
    console.log('Update timesheet response:', response);
    return response.data; // Return the data directly
  } catch (error) {
    console.error('Error updating timesheet:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};
export const deleteTimesheet = (id) => api.delete(`/timesheets/${id}`);


export const getStaffById = (id) => api.get(`/staff/${id}`);

// Work Order endpoints
export const getWorkOrders = async () => {
  const response = await axios.get('/api/workorders');
  return response.data;
};

export const createWorkOrder = async (workOrder) => {
  const response = await axios.post('/api/workorders', workOrder);
  return response.data;
};

export const updateWorkOrder = async (id, workOrder) => {
  const response = await axios.put(`/api/workorders/${id}`, workOrder);
  return response.data;
};

export const deleteWorkOrder = async (id) => {
  const response = await axios.delete(`/api/workorders/${id}`);
  return response.data;
};

export const getWorkOrderById = (id) => api.get(`/workorders/${id}`);

// Project endpoints
export const getProjects = async () => {
  const response = await axios.get('/api/projects');
  return response.data;
};

export const createProject = async (project) => {
  const response = await axios.post('/api/projects', project);
  return response.data;
};

export const updateProject = async (id, project) => {
  const response = await axios.put(`/api/projects/${id}`, project);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await axios.delete(`/api/projects/${id}`);
  return response.data;
};

export const getProjectById = (id) => api.get(`/projects/${id}`);

// Vessel endpoints
export const fetchVessels = async () => {
  const response = await api.get('/vessels');
  return response.data;
};

export const createVessel = async (vesselData) => {
  const response = await api.post('/vessels', vesselData);
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

// Client endpoints
export const getClients = async () => {
  try {
    console.log('Fetching clients from:', `${API_URL}/clients`);
    const response = await api.get('/clients');
    console.log('Client data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const createClient = async (clientData) => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

export const updateClient = async (id, clientData) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};

export const getVessels = async () => {
  const response = await axios.get('/api/vessels');
  return response.data;
};

// Discipline endpoints
export const getDisciplines = async () => {
  const response = await axios.get('/api/disciplines');
  return response.data;
};

export const createDiscipline = async (discipline) => {
  const response = await axios.post('/api/disciplines', discipline);
  return response.data;
};

export const updateDiscipline = async (id, discipline) => {
  const response = await axios.put(`/api/disciplines/${id}`, discipline);
  return response.data;
};

export const deleteDiscipline = async (id) => {
  const response = await axios.delete(`/api/disciplines/${id}`);
  return response.data;
};

export const getDiscipline = async (id) => {
  try {
    const response = await axios.get(`/api/disciplines/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching discipline:', error);
    throw error;
  }
};

// Add these functions to the existing api.js file

export const getStaff = async () => {
  try {
    const response = await axios.get('/api/staff');
    return response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

export const createStaff = async (staff) => {
  const response = await axios.post('/api/staff', staff);
  return response.data;
};

export const updateStaff = async (id, staff) => {
  const response = await axios.put(`/api/staff/${id}`, staff);
  return response.data;
};

export const deleteStaff = async (id) => {
  const response = await axios.delete(`/api/staff/${id}`);
  return response.data;
};

// Add this new function
export const getStaffByDiscipline = async (disciplineId) => {
  try {
    const response = await axios.get(`/api/staff/discipline/${disciplineId}`);
    console.log('here xxxa',response);
    return response.data;
  } catch (error) {
    console.error('Error fetching staff by discipline:', error);
    throw error;
  }
};

export default api;
