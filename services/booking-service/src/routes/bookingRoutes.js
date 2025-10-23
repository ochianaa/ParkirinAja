const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const roleMiddleware = require('../middleware/roleMiddleware');

console.log('roleMiddleware:', typeof roleMiddleware);

// PENYEWA (RENTER)
router.post('/', bookingController.createBooking); // Membuat permintaan booking baru
router.post('/:bookingId/payment', bookingController.startPayment); // Memulai proses pembayaran untuk booking tertentu
router.post('/:bookingId/review', bookingController.addReview); // Memberikan rating & review setelah sewa selesai
router.get('/renter/my-bookings', 
    roleMiddleware('renter'), bookingController.getMyBookings); // Mendapatkan semua booking milik penyewa
router.get('/renter/my-bookings/:id', bookingController.getMyBookingById); // Mendapatkan detail satu booking tertentu milik penyewa
router.post('/:bookingId/cancel', bookingController.cancelBooking); // Membatalkan booking yang sudah dibuat

// PEMILIK (OWNER)
router.get('/owner/requests', 
    roleMiddleware('owner'), bookingController.getOwnerRequests); // Mendapatkan daftar permintaan booking untuk garasi miliknya
router.post('/:bookingId/confirm', bookingController.confirmBooking); // Mengonfirmasi permintaan booking
router.post('/:bookingId/reject', bookingController.rejectBooking); // Menolak permintaan booking
router.get('/owner/reports/income', bookingController.getOwnerIncome); // Mendapatkan ringkasan pendapatan
router.get('/owner/reports/transactions', bookingController.getOwnerTransactions); // Mendapatkan riwayat detail transaksi

// PAYMENT GATEWAY
router.post('/payments/webhook', bookingController.handlePaymentWebhook); // Menerima notifikasi status pembayaran (webhook)

// ADMIN
router.get('/admin/bookings', 
    roleMiddleware('admin'), bookingController.getAllBookings); // Melihat semua data booking di platform
router.get('/admin/analytics', bookingController.getAnalyticsSummary); // Mendapatkan data analitik keseluruhan

module.exports = router;

