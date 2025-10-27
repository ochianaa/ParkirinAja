import apiClient from './ApiClient';

const getAllUsers = () => {
  return apiClient.get('/auth/users');
};

const updateGarageStatus = (garageId, status) => {
  return apiClient.put(`/garages/admin/garages/${garageId}/status`, { status });
};

const AdminService = {
  getAllUsers,
  updateGarageStatus,
};

export default AdminService;