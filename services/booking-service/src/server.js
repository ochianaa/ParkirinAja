const express = require('express');
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello from the Booking Service! 📅');
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Simple connection test using raw SQL
    await db.execute('SELECT 1');
    res.status(200).json({
      success: true,
      message: 'Booking service is healthy',
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.listen(PORT, async () => {
  console.log(`Booking Service attempting to start on port ${PORT}...`);
  try {
    // Test the database connection before announcing the server is ready
    await db.execute('SELECT 1');
    console.log('✅ Database connection has been established successfully.');
    console.log(`🚀 Booking Service is now running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
});