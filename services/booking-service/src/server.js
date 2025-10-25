const express = require('express');
const cors = require('cors');
const { db } = require('./db');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes utama
app.use('/bookings', bookingRoutes);

// Default route for booking service 
app.get('/', (req, res) => {
  res.send('Hello from the Booking Service! :date:');
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Simple connection test - handle both real and mock database
    if (db.execute) {
      await db.execute('SELECT 1');
    }
    res.status(200).json({
      success: true,
      message: 'Booking service is healthy:white_check_mark:',
      database: process.env.USE_MOCK_DB === 'true' ? 'mock' : 'connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed:x:',
      error: error.message
    });
  }
});

// Server run
app.listen(PORT, async () => {
  console.log(`Booking Service attempting to start on port ${PORT}...`);
  try {
    // Test the database connection before announcing the server is ready
    if (db.execute) {
      await db.execute('SELECT 1');
      console.log(':white_check_mark: Database connection has been established successfully.');
    } else {
      console.log(':warning: Running with mock database for testing.');
    }
    console.log(`🚀 Booking Service is now running on port ${PORT}`);
  } catch (error) {
    console.error(':x: Unable to connect to the database:', error);
  }
});