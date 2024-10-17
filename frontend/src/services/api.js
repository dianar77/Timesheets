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
export const updateTimesheet = (id, data) => api.put(`/timesheets/${id}`, data);
export const deleteTimesheet = (id) => api.delete(`/timesheets/${id}`);

// Staff endpoints
export const getStaff = async () => {
  console.log('Fetching staff from:', `${API_URL}/staff`);
  const response = await axios.get(`${API_URL}/staff`);
  return response.data;
};

export const getStaffById = (id) => api.get(`/staff/${id}`);

// Work Order endpoints
export const getWorkOrders = async () => {
  console.log('Fetching work orders from:', `${API_URL}/workorders`);
  const response = await axios.get(`${API_URL}/workorders`);
  return response.data;
};

export const getWorkOrderById = (id) => api.get(`/workorders/${id}`);

// Project endpoints
export const getProjects = () => api.get('/projects');
export const getProjectById = (id) => api.get(`/projects/${id}`);

// Vessel endpoints
export const getVessels = () => api.get('/vessels');
export const getVesselById = (id) => api.get(`/vessels/${id}`);

// Client endpoints
export const getClients = () => api.get('/clients');
export const getClientById = (id) => api.get(`/clients/${id}`);

export default api;
