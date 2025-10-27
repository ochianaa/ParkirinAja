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

const getFavorites = () => {
  return apiClient.get('/garages/favorites');
};

const addFavorite = (garageId) => {
  return apiClient.post('/garages/favorites', { garageId });
};

const removeFavorite = (garageId) => {
  return apiClient.delete(`/garages/favorites/${garageId}`);
};

const garageService = {
  createGarage,
  getMyGarages,
  updateGarage,
  deleteGarage,
  getAllGarages,
  getGarageById,
  getFavorites,
  addFavorite,
  removeFavorite
};

export default garageService;