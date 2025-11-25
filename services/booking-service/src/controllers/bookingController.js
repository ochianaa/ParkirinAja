const { db, bookings, reviews } = require('../db');
const { eq, and, inArray, or } = require('drizzle-orm');

// Validasi apakah garasi ada di garage service
const validateGarageExists = async (garageId) => {
  try {
    // In a microservices architecture, this should call the garage service
    const garageServiceUrl = process.env.GARAGE_SERVICE_URL || 'http://localhost:8080/api/garages';
    const url = `${garageServiceUrl}/${garageId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // 5 second timeout
    });

    if (response.ok) {
      const garage = await response.json();
      return { exists: true, garage };
    } else if (response.status === 404) {
      return { exists: false, error: 'Garage not found' };
    } else {
      return { exists: false, error: 'Garage service error' };
    }
  } catch (error) {
    console.error('Error validating garage:', error);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      return { exists: false, error: 'Garage service timeout' };
    } else if (error.code === 'ECONNREFUSED') {
      return { exists: false, error: 'Garage service connection refused' };
    } else if (error.code === 'ENOTFOUND') {
      return { exists: false, error: 'Garage service host not found' };
    } else {
      return { exists: false, error: `Garage service unavailable: ${error.message}` };
    }
  }
};

// Validasi apakah owner memiliki garasi tertentu
const validateGarageOwnership = async (ownerId, garageId) => {
  try {
    const garageServiceUrl = process.env.GARAGE_SERVICE_URL || 'http://localhost:8080/api/garages';
    const url = `${garageServiceUrl}/${garageId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    if (response.ok) {
      const garage = await response.json();
      // Check if the garage belongs to the owner
      return { 
        isOwner: garage && garage.owner_id === ownerId, 
        garage: garage 
      };
    } else if (response.status === 404) {
      return { isOwner: false, error: 'Garage not found' };
    } else {
      return { isOwner: false, error: 'Garage service error' };
    }
  } catch (error) {
    console.error('Error validating garage ownership:', error);
    return { isOwner: false, error: `Garage service unavailable: ${error.message}` };
  }
};

// Mendapatkan daftar garasi milik owner
const getOwnerGarages = async (ownerId, authToken) => {
  try {
    const garageServiceUrl = process.env.GARAGE_SERVICE_URL || 'http://localhost:8080/api/garages';
    const url = `${garageServiceUrl}/owner/my-garages`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      timeout: 5000,
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, garages: result || [] };
    } else {
      return { success: false, error: 'Failed to fetch owner garages' };
    }
  } catch (error) {
    console.error('Error fetching owner garages:', error);
    return { success: false, error: `Garage service unavailable: ${error.message}` };
  }
};

// Mendapatkan informasi user dari auth service
const getUserInfo = async (userId, authToken) => {
  try {
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8080/api/auth';
    const url = `${authServiceUrl}/user-info/${userId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      timeout: 5000,
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, user: result.data.user };
    } else {
      console.error('Failed to fetch user info:', response.status, response.statusText);
      return { success: false, error: 'Failed to fetch user information' };
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return { success: false, error: `Auth service unavailable: ${error.message}` };
  }
};

// Mendapatkan informasi garage dari garage service
const getGarageInfo = async (garageId, authToken) => {
  try {
    const garageServiceUrl = process.env.GARAGE_SERVICE_URL || 'http://localhost:8080/api/garages';
    const url = `${garageServiceUrl}/${garageId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      timeout: 5000,
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, garage: result };
    } else {
      return { success: false, error: 'Failed to fetch garage information' };
    }
  } catch (error) {
    console.error('Error fetching garage info:', error);
    return { success: false, error: `Garage service unavailable: ${error.message}` };
  }
};

// PENYEWA (RENTER)

// Membuat permintaan booking baru
exports.createBooking = async (req, res) => {
  try {
    // Ambil user ID dari JWT (jika ada), atau fallback ke body
    const userId = req.user?.userId || req.body.user_id;
    const { garage_id, start_time, end_time, total_price, notes } = req.body;

    // Validasi input agar semua kolom wajib terisi
    if (!userId || !garage_id || !start_time || !end_time || !total_price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validasi bahwa garage_id exists
    const garageValidation = await validateGarageExists(garage_id);
    if (!garageValidation.exists) {
      return res.status(400).json({ 
        message: "Invalid garage_id", 
        error: garageValidation.error 
      });
    }

    // Validasi waktu booking (start_time harus sebelum end_time)
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    
    if (startTime >= endTime) {
      return res.status(400).json({ 
        message: "Invalid time range: start_time must be before end_time" 
      });
    }

    // Validasi bahwa booking tidak di masa lalu
    const now = new Date();
    if (startTime < now) {
      return res.status(400).json({ 
        message: "Invalid booking time: cannot book in the past" 
      });
    }

    // Simpan data booking baru ke database
    const [newBooking] = await db
      .insert(bookings)
      .values({
        user_id: userId,
        garage_id,
        start_time: startTime,
        end_time: endTime,
        total_price,
        status: "pending",
        payment_status: "unpaid",
        notes: notes || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning(); // mengembalikan data yang baru dibuat

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
    const userId = req.user?.userId || req.query.user_id;

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
    if (req.user && booking.user_id !== req.user.userId) {
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
      .returning();

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
    const ownerId = req.user?.userId;
    const authToken = req.header('Authorization')?.replace('Bearer ', '');

    // Get owner's garages from garage service
    const ownerGaragesResult = await getOwnerGarages(ownerId, authToken);
    
    if (!ownerGaragesResult.success) {
      return res.status(503).json({ 
        message: "Unable to fetch garage information",
        error: ownerGaragesResult.error 
      });
    }

    const ownerGarageIds = ownerGaragesResult.garages.map(garage => garage.garage_id);
    
    if (ownerGarageIds.length === 0) {
      return res.status(200).json({
        message: "No garages found for this owner",
        data: [],
        garage_count: 0
      });
    }

    // Filter bookings by owned garages only
    const ownerBookings = await db
      .select()
      .from(bookings)
      .where(inArray(bookings.garage_id, ownerGarageIds));

    // Create a map of garage information for quick lookup
    const garageMap = {};
    ownerGaragesResult.garages.forEach(garage => {
      garageMap[garage.garage_id] = garage;
    });

    // Enhance bookings with nested user and garage information
    const enhancedBookings = await Promise.all(
      ownerBookings.map(async (booking) => {
        // Get user information
        const userResult = await getUserInfo(booking.user_id, authToken);
        const userName = userResult.success ? userResult.user.name || userResult.user.username || 'Unknown User' : 'Unknown User';
        
        // Get garage information from our map
        const garage = garageMap[booking.garage_id];
        const garageName = garage ? garage.name || garage.garage_name || 'Unknown Garage' : 'Unknown Garage';

        // Remove user_id and garage_id from the booking object since they're in nested objects
        const { user_id, garage_id, ...bookingWithoutIds } = booking;
        
        return {
          ...bookingWithoutIds,
          users: {
            user_id: booking.user_id,
            user_name: userName
          },
          garages: {
            garage_id: booking.garage_id,
            garage_name: garageName
          }
        };
      })
    );

    res.status(200).json({
      message: "Fetched owner booking requests successfully",
      data: enhancedBookings,
      garage_count: ownerGarageIds.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan semua booking requests untuk garasi milik owner (semua status)
exports.getAllOwnerRequests = async (req, res) => {
  try {
    const ownerId = req.user?.userId;
    const authToken = req.header('Authorization')?.replace('Bearer ', '');

    // Get owner's garages from garage service
    const ownerGaragesResult = await getOwnerGarages(ownerId, authToken);
    
    if (!ownerGaragesResult.success) {
      return res.status(503).json({ 
        message: "Unable to fetch garage information",
        error: ownerGaragesResult.error 
      });
    }

    const ownerGarageIds = ownerGaragesResult.garages.map(garage => garage.garage_id);
    
    if (ownerGarageIds.length === 0) {
      return res.status(200).json({
        message: "No garages found for this owner",
        data: [],
        garage_count: 0
      });
    }

    // Get ALL bookings for owned garages (no status filter)
    const ownerBookings = await db
      .select()
      .from(bookings)
      .where(inArray(bookings.garage_id, ownerGarageIds));

    // Create a map of garage information for quick lookup
    const garageMap = {};
    ownerGaragesResult.garages.forEach(garage => {
      garageMap[garage.garage_id] = garage;
    });

    // Enhance bookings with nested user and garage information
    const enhancedBookings = await Promise.all(
      ownerBookings.map(async (booking) => {
        // Get user information
        const userResult = await getUserInfo(booking.user_id, authToken);
        const userName = userResult.success ? userResult.user.name || userResult.user.username || 'Unknown User' : 'Unknown User';
        
        // Get garage information from our map
        const garage = garageMap[booking.garage_id];
        const garageName = garage ? garage.name || garage.garage_name || 'Unknown Garage' : 'Unknown Garage';

        // Remove user_id and garage_id from the booking object since they're in nested objects
        const { user_id, garage_id, ...bookingWithoutIds } = booking;
        
        return {
          ...bookingWithoutIds,
          users: {
            user_id: booking.user_id,
            user_name: userName
          },
          garages: {
            garage_id: booking.garage_id,
            garage_name: garageName
          }
        };
      })
    );

    // Group bookings by status for better organization
    const bookingsByStatus = enhancedBookings.reduce((acc, booking) => {
      const status = booking.status || 'unknown';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(booking);
      return acc;
    }, {});

    res.status(200).json({
      message: "Fetched all owner booking requests successfully",
      data: enhancedBookings,
      data_by_status: bookingsByStatus,
      total_bookings: enhancedBookings.length,
      garage_count: ownerGarageIds.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengonfirmasi permintaan booking
exports.confirmBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const ownerId = req.user?.userId;

    // First, get the booking to check which garage it belongs to
    const bookingResult = await db
      .select()
      .from(bookings)
      .where(eq(bookings.booking_id, bookingId));

    if (bookingResult.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = bookingResult[0];

    // Validate garage ownership
    const ownershipResult = await validateGarageOwnership(ownerId, booking.garage_id);
    
    if (!ownershipResult.isOwner) {
      if (ownershipResult.error) {
        return res.status(503).json({ 
          message: "Unable to validate garage ownership",
          error: ownershipResult.error 
        });
      }
      return res.status(403).json({ 
        message: "Access denied. You can only confirm bookings for your own garages." 
      });
    }

    const [updated] = await db
      .update(bookings)
      .set({
        status: 'confirmed',
        updated_at: new Date(),
      })
      .where(eq(bookings.booking_id, bookingId))
      .returning();

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
    const ownerId = req.user?.userId;

    // First, get the booking to check which garage it belongs to
    const bookingResult = await db
      .select()
      .from(bookings)
      .where(eq(bookings.booking_id, bookingId));

    if (bookingResult.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = bookingResult[0];

    // Validate garage ownership
    const ownershipResult = await validateGarageOwnership(ownerId, booking.garage_id);
    
    if (!ownershipResult.isOwner) {
      if (ownershipResult.error) {
        return res.status(503).json({ 
          message: "Unable to validate garage ownership",
          error: ownershipResult.error 
        });
      }
      return res.status(403).json({ 
        message: "Access denied. You can only reject bookings for your own garages." 
      });
    }

    const [updated] = await db
      .update(bookings)
      .set({
        status: 'rejected',
        updated_at: new Date(),
      })
      .where(eq(bookings.booking_id, bookingId))
      .returning();

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
      .returning();

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

// Memulai proses pembayaran untuk booking tertentu (simplified version)
exports.startPayment = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    // Find the booking
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.booking_id, bookingId));

    if (result.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = result[0];

    // Check if user owns this booking
    if (req.user && booking.user_id !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if booking is already paid
    if (booking.payment_status === 'paid') {
      return res.status(400).json({ 
        message: "Payment already completed for this booking",
        data: booking
      });
    }

    // Automatically complete payment and booking (simplified implementation)
    const [updated] = await db
      .update(bookings)
      .set({
        payment_status: 'paid',
        status: 'completed',
        updated_at: new Date(),
      })
      .where(eq(bookings.booking_id, bookingId))
      .returning();

    res.status(200).json({
      message: "Payment completed successfully (simplified version)",
      data: updated,
      note: "This is a simplified implementation. Booking automatically completed upon payment request."
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Memberikan rating & review setelah sewa selesai
exports.addReview = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const { rating, review_text } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Find the booking
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.booking_id, bookingId));

    if (result.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = result[0];

    // Check if user owns this booking
    if (req.user && booking.user_id !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: "Can only review completed bookings" });
    }

    // Check if review already exists for this booking
    const existingReview = await db
      .select()
      .from(reviews)
      .where(eq(reviews.booking_id, bookingId));

    if (existingReview.length > 0) {
      return res.status(400).json({ message: "Review already exists for this booking" });
    }

    // Create the review
    const newReview = await db
      .insert(reviews)
      .values({
        booking_id: bookingId,
        user_id: booking.user_id,
        garage_id: booking.garage_id,
        rating,
        review_text: review_text || null,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning();

    res.status(201).json({
      message: "Review added successfully",
      data: newReview[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reviews for a specific garage
exports.getGarageReviews = async (req, res) => {
  try {
    const garageId = Number(req.params.garageId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get reviews for the garage with pagination
    const garageReviews = await db
      .select({
        review_id: reviews.review_id,
        booking_id: reviews.booking_id,
        user_id: reviews.user_id,
        rating: reviews.rating,
        review_text: reviews.review_text,
        created_at: reviews.created_at
      })
      .from(reviews)
      .where(eq(reviews.garage_id, garageId))
      .orderBy(reviews.created_at)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: reviews.review_id })
      .from(reviews)
      .where(eq(reviews.garage_id, garageId));

    // Calculate average rating
    const avgRating = await db
      .select({ avg: reviews.rating })
      .from(reviews)
      .where(eq(reviews.garage_id, garageId));

    const averageRating = avgRating.length > 0 ? 
      (garageReviews.reduce((sum, review) => sum + review.rating, 0) / garageReviews.length).toFixed(1) : 0;

    res.status(200).json({
      message: "Reviews retrieved successfully",
      data: {
        reviews: garageReviews,
        pagination: {
          page,
          limit,
          total: totalCount.length,
          totalPages: Math.ceil(totalCount.length / limit)
        },
        summary: {
          averageRating: parseFloat(averageRating),
          totalReviews: totalCount.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reviews by a specific user
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user ? req.user.userId : Number(req.params.userId);
    
    // If accessing via params, ensure user can only access their own reviews
    if (req.params.userId && req.user && req.user.userId !== Number(req.params.userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userReviews = await db
      .select({
        review_id: reviews.review_id,
        booking_id: reviews.booking_id,
        garage_id: reviews.garage_id,
        rating: reviews.rating,
        review_text: reviews.review_text,
        created_at: reviews.created_at
      })
      .from(reviews)
      .where(eq(reviews.user_id, userId))
      .orderBy(reviews.created_at);

    res.status(200).json({
      message: "User reviews retrieved successfully",
      data: userReviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific review by ID
exports.getReviewById = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);

    const review = await db
      .select()
      .from(reviews)
      .where(eq(reviews.review_id, reviewId));

    if (review.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      message: "Review retrieved successfully",
      data: review[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan ringkasan pendapatan owner
exports.getOwnerIncome = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const authToken = req.header('Authorization')?.replace('Bearer ', '');

    // Get owner's garages from garage service
    const ownerGaragesResult = await getOwnerGarages(ownerId, authToken);
    
    if (!ownerGaragesResult.success) {
      return res.status(503).json({ 
        message: "Unable to fetch garage information",
        error: ownerGaragesResult.error 
      });
    }

    const ownerGarageIds = ownerGaragesResult.garages.map(garage => garage.garage_id);
    
    if (ownerGarageIds.length === 0) {
      return res.status(200).json({
        message: "No garages found for this owner",
        data: {
          total_income: 0,
          total_bookings: 0,
          period: "all_time"
        },
      });
    }

    // Filter paid bookings by owned garages only
    const paidBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.payment_status, 'paid'),
          inArray(bookings.garage_id, ownerGarageIds)
        )
      );

    const totalIncome = paidBookings.reduce((acc, booking) => acc + Number(booking.total_price), 0);

    res.status(200).json({
      message: "Owner income fetched successfully",
      data: {
        total_income: totalIncome,
        total_bookings: paidBookings.length,
        period: "all_time",
        garage_count: ownerGarageIds.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan riwayat detail transaksi owner
exports.getOwnerTransactions = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const authToken = req.header('Authorization')?.replace('Bearer ', '');

    // Get owner's garages from garage service
    const ownerGaragesResult = await getOwnerGarages(ownerId, authToken);
    
    if (!ownerGaragesResult.success) {
      return res.status(503).json({ 
        message: "Unable to fetch garage information",
        error: ownerGaragesResult.error 
      });
    }

    const ownerGarageIds = ownerGaragesResult.garages.map(garage => garage.garage_id);
    
    if (ownerGarageIds.length === 0) {
      return res.status(200).json({
        message: "No garages found for this owner",
        data: [],
      });
    }

    // Filter paid bookings by owned garages only
    const transactions = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.payment_status, 'paid'),
          inArray(bookings.garage_id, ownerGarageIds)
        )
      );

    res.status(200).json({
      message: "Owner transactions fetched successfully",
      data: transactions,
      garage_count: ownerGarageIds.length
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
