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
  return apiClient.put(`/bookings/owner/requests/${bookingId}/confirm`);
};

const rejectBooking = (bookingId) => {
  return apiClient.put(`/bookings/owner/requests/${bookingId}/reject`);
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

const bookingService = {
  createBooking,
  getMyBookings,
  getMyBookingById,
  getBookingRequests,
  confirmBooking,
  rejectBooking,
  cancelBooking,
  getAllBookingsForAdmin,
  startPayment
};

export default bookingService;