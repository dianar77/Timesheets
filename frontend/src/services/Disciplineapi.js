import api from './api';

// Discipline endpoints
export const getDisciplines = async () => {
    const response = await api.get('/disciplines');
    return response.data;
  };
  
  export const getDisciplineById = (id) => api.get('/disciplines/${id}');
  
  export const createDiscipline = async (discipline) => {
    const response = await api.post('/disciplines', discipline);
    return response.data;
  };
  
  export const updateDiscipline = async (id, discipline) => {
    const response = await api.put('/disciplines/${id}', discipline);
    return response.data;
  };
  
  export const deleteDiscipline = async (id) => {
    const response = await api.delete('/disciplines/${id}');
    return response.data;
  };

  export const getDisciplinesDropdownList = () => {
    return api.get('/disciplines/dropdown/list');
  };
  