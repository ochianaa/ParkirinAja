import apiClient from './ApiClient';

const createBooking = (bookingData) => {
  return apiClient.post('/bookings', bookingData);
};

const getMyBookings = () => {
  return apiClient.get('/bookings/renter/my-bookings');
};

const bookingService = {
  createBooking,
  getMyBookings
};

export default bookingService;