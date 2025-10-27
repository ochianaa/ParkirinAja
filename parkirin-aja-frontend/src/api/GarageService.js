import apiClient from './ApiClient';

const createGarage = (garageData) => {
  return apiClient.post('/garages', garageData);
};

const getMyGarages = () => {
  return apiClient.get('/garages/owner/my-garages');
};

const updateGarage = (garageId, garageData) => {
  return apiClient.put(`/garages/${garageId}`, garageData);
};

const deleteGarage = (garageId) => {
  return apiClient.delete(`/garages/${garageId}`);
};

const getAllGarages = () => {
  return apiClient.get('/garages');
};

const getGarageById = (garageId) => {
  return apiClient.get(`/garages/${garageId}`);
};

const garageService = {
  createGarage,
  getMyGarages,
  updateGarage,
  deleteGarage,
  getAllGarages,
  getGarageById
};

export default garageService;