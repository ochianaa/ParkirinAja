import apiClient from './ApiClient';

const getAllUsers = () => {
  return apiClient.get('/auth/users');
};

const AdminService = {
  getAllUsers,
};

export default AdminService;