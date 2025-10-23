import apiClient from './ApiClient';

const register = (userData) => {
  return apiClient.post('/auth/register', userData);
};

const login = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

const logout = () => {
  return apiClient.post('/auth/logout');
};

const getProfile = () => {
  return apiClient.get('/auth/profile');
};

const updateProfile = (profileData) => {
  return apiClient.put('/auth/profile', profileData);
};

const AuthService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};

export default AuthService;