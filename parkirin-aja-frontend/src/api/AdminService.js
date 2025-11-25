import apiClient from './ApiClient';

const getAllUsers = () => {
  return apiClient.get('/auth/users');
};

const updateGarageStatus = (garageId, status) => {
  return apiClient.put(`/garages/admin/garages/${garageId}/status`, { status });
};

const getUserById = (userId) => {
  return apiClient.get(`/auth/users/${userId}`);
};

const AdminService = {
  getAllUsers,
  updateGarageStatus,
  getUserById,
};

export default AdminService;