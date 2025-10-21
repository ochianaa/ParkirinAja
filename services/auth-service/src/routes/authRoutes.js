const express = require('express');
const authController = require('../controllers/authController');
const { db } = require('../db');

const router = express.Router();

// GET /health - Health check endpoint
router.get('/health', async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({ status: 'healthy', service: 'auth-service' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', service: 'auth-service', error: error.message });
  }
});

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// Future routes can be added here:
// router.post('/logout', authController.logout);
// router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;