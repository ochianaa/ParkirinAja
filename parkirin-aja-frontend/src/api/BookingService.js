import apiClient from './ApiClient';

const createBooking = (bookingData) => {
  return apiClient.post('/bookings', bookingData);
};

const getMyBookings = () => {
  return apiClient.get('/bookings/renter/my-bookings');
};

const getMyBookingById = (bookingId) => {
  return apiClient.get(`/bookings/renter/my-bookings/${bookingId}`);
};

const getBookingRequests = () => {
  return apiClient.get('/bookings/owner/requests');
};

const confirmBooking = (bookingId) => {
  return apiClient.post(`/bookings/${bookingId}/confirm`);
};

const rejectBooking = (bookingId) => {
  return apiClient.post(`/bookings/${bookingId}/reject`);
};

const cancelBooking = (bookingId) => {
  return apiClient.post(`/bookings/${bookingId}/cancel`);
};

const getAllBookingsForAdmin = () => {
  return apiClient.get('/bookings/admin/bookings');
};

const startPayment = (bookingId) => {
  return apiClient.post(`/bookings/${bookingId}/payment`);
};

const getOwnerTransactions = () => {
  return apiClient.get('/bookings/owner/reports/transactions');
};

const getOwnerIncome = () => {
  return apiClient.get('/bookings/owner/reports/income');
};

const getAdminAnalytics = () => {
  return apiClient.get('/bookings/admin/analytics');
};

const bookingService = {
  createBooking,
  getMyBookings,
  getMyBookingById,
  getBookingRequests,
  confirmBooking,
  rejectBooking,
  cancelBooking,
  getAllBookingsForAdmin,
  startPayment,
  getOwnerTransactions,
  getOwnerIncome,
  getAdminAnalytics
};

export default bookingService;