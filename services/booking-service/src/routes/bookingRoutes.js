const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// PENYEWA (RENTER)
router.post('/', authMiddleware, bookingController.createBooking); // Membuat permintaan booking baru
router.post('/:bookingId/payment', authMiddleware, bookingController.startPayment); // Memulai proses pembayaran untuk booking tertentu
router.post('/:bookingId/review', authMiddleware, bookingController.addReview); // Memberikan rating & review setelah sewa selesai
router.get('/renter/my-bookings', 
    authMiddleware, roleMiddleware('renter'), bookingController.getMyBookings); // Mendapatkan semua booking milik penyewa
router.get('/renter/my-bookings/:id', authMiddleware, bookingController.getMyBookingById); // Mendapatkan detail satu booking tertentu milik penyewa
router.post('/:bookingId/cancel', authMiddleware, bookingController.cancelBooking); // Membatalkan booking yang sudah dibuat

// REVIEW ENDPOINTS
router.get('/reviews/garage/:garageId', bookingController.getGarageReviews); // Mendapatkan semua review untuk garasi tertentu (public)
router.get('/reviews/user/my-reviews', authMiddleware, bookingController.getUserReviews); // Mendapatkan semua review milik user yang sedang login
router.get('/reviews/:reviewId', bookingController.getReviewById); // Mendapatkan detail review tertentu (public)

// PEMILIK (OWNER)
router.get('/owner/requests', 
    authMiddleware, roleMiddleware('owner'), bookingController.getOwnerRequests); // Mendapatkan daftar permintaan booking untuk garasi miliknya
router.post('/:bookingId/confirm', authMiddleware, roleMiddleware('owner'), bookingController.confirmBooking); // Mengonfirmasi permintaan booking
router.post('/:bookingId/reject', authMiddleware, roleMiddleware('owner'), bookingController.rejectBooking); // Menolak permintaan booking
router.get('/owner/reports/income', authMiddleware, roleMiddleware('owner'), bookingController.getOwnerIncome); // Mendapatkan ringkasan pendapatan
router.get('/owner/reports/transactions', authMiddleware, roleMiddleware('owner'), bookingController.getOwnerTransactions); // Mendapatkan riwayat detail transaksi

// PAYMENT GATEWAY
router.post('/payments/webhook', bookingController.handlePaymentWebhook); // Menerima notifikasi status pembayaran (webhook)

// ADMIN
router.get('/admin/bookings', 
    authMiddleware, roleMiddleware('admin'), bookingController.getAllBookings); // Melihat semua data booking di platform
router.get('/admin/analytics', authMiddleware, roleMiddleware('admin'), bookingController.getAnalyticsSummary); // Mendapatkan data analitik keseluruhan

module.exports = router;