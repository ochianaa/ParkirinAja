const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const roleMiddleware = require('../middlewares/roleMiddleware');

// PENYEWA (RENTER)

// Membuat permintaan booking baru
router.post('/bookings', bookingController.createBooking);

// Memulai proses pembayaran untuk booking tertentu
router.post('/:bookingId/payment', bookingController.startPayment);

// Memberikan rating & review setelah sewa selesai
router.post('/:bookingId/review', bookingController.addReview);

// Mendapatkan semua booking milik penyewa
router.get('/renter/my-bookings', bookingController.getMyBookings);

// Mendapatkan detail satu booking tertentu milik penyewa
router.get('/renter/my-bookings/:id', bookingController.getMyBookingById);

// Membatalkan booking yang sudah dibuat
router.post('/:bookingId/cancel', bookingController.cancelBooking);

// PEMILIK (OWNER)

// Mendapatkan daftar permintaan booking untuk garasi miliknya
router.get('/owner/requests', bookingController.getOwnerRequests);

// Mengonfirmasi permintaan booking
router.post('/:bookingId/confirm', bookingController.confirmBooking);

// Menolak permintaan booking
router.post('/:bookingId/reject', bookingController.rejectBooking);

// Mendapatkan ringkasan pendapatan
router.get('/owner/reports/income', bookingController.getOwnerIncome);

// Mendapatkan riwayat detail transaksi
router.get('/owner/reports/transactions', bookingController.getOwnerTransactions);

// PAYMENT GATEWAY

// Menerima notifikasi status pembayaran (webhook)
router.post('/payments/webhook', bookingController.handlePaymentWebhook);

// ADMIN

// Melihat semua data booking di platform
router.get('/admin/bookings', bookingController.getAllBookings);

// Mendapatkan data analitik keseluruhan
router.get('/admin/analytics', bookingController.getAnalyticsSummary);

module.exports = router;
