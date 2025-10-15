// services/auth-service/src/server.js

const express = require('express');
const cors = require('cors'); // Use the cors library
require('dotenv').config();

// Import the database instance from the models folder
const db = require('../models');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); // Simplified, robust CORS handling
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Routes ---
// The auth-service is only responsible for the routes defined in authRoutes.
// The /api/auth prefix is handled by the gateway.
app.use('/', authRoutes);

// --- Error Handling ---
// 404 handler for routes that don't exist
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found in auth-service'
  });
});

// Generic error handler (catches errors from controllers)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});


// --- Start Server ---
app.listen(PORT, async () => {
  console.log(`Auth Service attempting to start on port ${PORT}...`);
  try {
    // Test the database connection before announcing the server is ready
    await db.sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    console.log(`🚀 Auth Service is now running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
});