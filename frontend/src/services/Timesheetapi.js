import api from './api';

// Timesheet endpoints
export const getTimesheets = async () => {
    try {
      const response = await api.get(`/timesheets`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching timesheets:`, error);
      throw error;
    }
  };
  
  export const getTimesheetById = (id) => api.get(`/timesheets/${id}`);
  export const createTimesheet = (data) => api.post(`/timesheets`, data);
  export const updateTimesheet = async (id, timesheetData) => {
    try {
      const response = await api.put(`/timesheets/${id}`, timesheetData);
      return response.data; // Return the data directly
    } catch (error) {
      console.error(`Error updating timesheet:`, error);
      if (error.response) {
        console.error(`Error response:`, error.response.data);
        console.error(`Error status:`, error.response.status);
        console.error(`Error headers:`, error.response.headers);
      } else if (error.request) {
        console.error(`Error request:`, error.request);
      } else {
        console.error(`Error message:`, error.message);
      }
      throw error;
    }
  };
  export const deleteTimesheet = (id) => api.delete(`/timesheets/${id}`);


  export const getTimesheetByStaff = async (staffId) => {
    try {
      const response = await api.get(`/timesheets/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching timesheet by staff:`, error);
      throw error;
    }
  };

  export const getTimesheetByWorkOrder = async (workOrderId) => {
    try {
      const response = await api.get(`/timesheets/workOrder/${workOrderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching timesheet by work order:`, error);
      throw error;
    }
  };



  export const getTimesheetDropdownList = () => {
    return api.get(`/timesheets/dropdown/list`);
  };
  
  