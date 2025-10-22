const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { body } = require('express-validator');
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

// Validation middleware for registration
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  body('role')
    .optional()
    .isIn(['owner', 'renter'])
    .withMessage('Role must be one of: owner, renter')
];

// Validation middleware for login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation middleware for profile update
const updateProfileValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  body('currentPassword')
    .optional()
    .notEmpty()
    .withMessage('Current password cannot be empty if provided'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Validation middleware for admin registration (same as register but without role field)
const adminRegisterValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters')
];

// POST /api/auth/register
router.post('/register', registerValidation, authController.register);

// POST /api/auth/register/admin (Admin Only)
router.post('/register/admin', authMiddleware, adminMiddleware, adminRegisterValidation, authController.registerAdmin);

// POST /api/auth/login
router.post('/login', loginValidation, authController.login);

// POST /api/auth/logout (Login Required)
router.post('/logout', authMiddleware, authController.logout);

// GET /api/auth/profile (Login Required)
router.get('/profile', authMiddleware, authController.getProfile);

// PUT /api/auth/profile (Login Required)
router.put('/profile', authMiddleware, updateProfileValidation, authController.updateProfile);

module.exports = router;