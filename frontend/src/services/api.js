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

// Staff endpoints
export const getStaff = async () => {
  console.log('Fetching staff from:', `${API_URL}/staff`);
  const response = await axios.get(`${API_URL}/staff`);
  return response.data;
};

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

export default api;
