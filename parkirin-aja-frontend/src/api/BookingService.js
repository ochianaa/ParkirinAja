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

const bookingService = {
  createBooking,
  getMyBookings,
  getMyBookingById
};

export default bookingService;