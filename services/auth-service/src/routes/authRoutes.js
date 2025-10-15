const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post('/register', authController.register);

// Future routes can be added here:
// router.post('/login', authController.login);
// router.post('/logout', authController.logout);
// router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;