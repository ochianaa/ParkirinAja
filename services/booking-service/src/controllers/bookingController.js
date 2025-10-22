const { db, bookings } = require('../db');
const { eq } = require('drizzle-orm');

// PENYEWA (RENTER)

// Membuat permintaan booking baru
exports.createBooking = async (req, res) => {
  try {
    // Ambil user ID dari JWT (jika ada), atau fallback ke body
    const userId = req.user?.id || req.body.user_id;
    const { garage_id, start_time, end_time, total_price, notes } = req.body;

    // Validasi input agar semua kolom wajib terisi
    if (!userId || !garage_id || !start_time || !end_time || !total_price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Simpan data booking baru ke database
    const [newBooking] = await db
      .insert(bookings)
      .values({
        user_id: userId,
        garage_id,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        total_price,
        status: "pending",
        payment_status: "unpaid",
        notes: notes || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*'); // mengembalikan data yang baru dibuat

    // Kirim respon sukses
    res.status(201).json({
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan semua booking milik penyewa
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.user_id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Ambil semua booking berdasarkan user_id
    const userBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.user_id, Number(userId)));

    res.status(200).json({
      message: "Fetched user bookings successfully",
      data: userBookings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan detail satu booking tertentu milik penyewa
exports.getMyBookingById = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.booking_id, bookingId));

    if (result.length === 0)
      return res.status(404).json({ message: "Booking not found" });

    const booking = result[0];

    // Cek otorisasi: hanya user pemilik booking yang boleh lihat
    if (req.user && booking.user_id !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Membatalkan booking
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    const [updated] = await db
      .update(bookings)
      .set({
        status: 'cancelled',
        updated_at: new Date(),
      })
      .where(eq(bookings.booking_id, bookingId))
      .returning('*');

    if (!updated)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({
      message: "Booking cancelled successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PEMILIK (OWNER)

// Mendapatkan daftar permintaan booking untuk garasi milik owner
exports.getOwnerRequests = async (req, res) => {
  try {
    const ownerId = req.user?.id;

    // TODO: Nanti bisa diubah untuk join ke tabel garages (owner_id)
    const ownerBookings = await db.select().from(bookings);

    res.status(200).json({
      message: "Fetched owner booking requests successfully",
      data: ownerBookings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengonfirmasi permintaan booking
exports.confirmBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    const [updated] = await db
      .update(bookings)
      .set({
        status: 'confirmed',
        updated_at: new Date(),
      })
      .where(eq(bookings.booking_id, bookingId))
      .returning('*');

    if (!updated)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({
      message: "Booking confirmed successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menolak permintaan booking
exports.rejectBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    const [updated] = await db
      .update(bookings)
      .set({
        status: 'rejected',
        updated_at: new Date(),
      })
      .where(eq(bookings.booking_id, bookingId))
      .returning('*');

    if (!updated)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({
      message: "Booking rejected successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PAYMENT GATEWAY

// Webhook untuk update status pembayaran otomatis
exports.handlePaymentWebhook = async (req, res) => {
  try {
    const { booking_id, transaction_status } = req.body;

    if (!booking_id || !transaction_status) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    // Tentukan status baru berdasarkan notifikasi pembayaran
    let newStatus;
    if (["settlement", "success"].includes(transaction_status)) {
      newStatus = "paid";
    } else if (transaction_status === "pending") {
      newStatus = "processing";
    } else {
      newStatus = "failed";
    }

    // Update status pembayaran di database
    const [updated] = await db
      .update(bookings)
      .set({
        payment_status: newStatus,
        updated_at: new Date(),
      })
      .where(eq(bookings.booking_id, Number(booking_id)))
      .returning('*');

    if (!updated)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({
      message: "Payment webhook processed successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ADMIN

// Melihat semua data booking di platform
exports.getAllBookings = async (req, res) => {
  try {
    const allBookings = await db.select().from(bookings);
    res.status(200).json({
      message: "All bookings fetched successfully",
      data: allBookings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan data analitik keseluruhan
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const allBookings = await db.select().from(bookings);

    // Hitung total dan pendapatan
    const totalBookings = allBookings.length;
    const totalRevenue = allBookings
      .filter(b => b.payment_status === "paid")
      .reduce((acc, curr) => acc + Number(curr.total_price), 0);

    res.status(200).json({
      message: "Analytics summary fetched successfully",
      summary: { totalBookings, totalRevenue },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
