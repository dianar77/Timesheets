import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Timesheet endpoints
export const getTimesheets = () => api.get('/timesheets');
export const getTimesheetById = (id) => api.get(`/timesheets/${id}`);
export const createTimesheet = (data) => api.post('/timesheets', data);
export const updateTimesheet = (id, data) => api.put(`/timesheets/${id}`, data);
export const deleteTimesheet = (id) => api.delete(`/timesheets/${id}`);

// Staff endpoints
export const getStaff = () => api.get('/staff');
export const getStaffById = (id) => api.get(`/staff/${id}`);

// Work Order endpoints
export const getWorkOrders = () => api.get('/workorders');
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