
const express = require('express');
const { body } = require('express-validator');
const garageController = require('../controllers/garageController');
const { db } = require('../db');

// Middlewares
const { authenticate } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const { isOwner } = require('../middleware/ownerMiddleware');
const { isRenter } = require('../middleware/renterMiddleware');

const router = express.Router();

/* ---------------------------------------------
   HEALTH CHECK
----------------------------------------------*/
router.get('/health', async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({ status: 'healthy', service: 'garage-service' });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'garage-service',
      error: error.message,
    });
  }
});

/* ---------------------------------------------
   VALIDATION RULES
----------------------------------------------*/
const garageValidation = [
  body('name')
    .isLength({ min: 3 })
    .withMessage('Garage name must be at least 3 characters long'),
  body('address')
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters long'),
  body(['pricePerHour', 'price_per_hour'])
    .custom((value, { req }) => {
      const pricePerHour = req.body.pricePerHour;
      const price_per_hour = req.body.price_per_hour;
      const finalPrice = price_per_hour || pricePerHour;
      
      if (!finalPrice || isNaN(finalPrice)) {
        throw new Error('Price per hour must be a valid number');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['available', 'unavailable'])
    .withMessage('Status must be either available or unavailable'),
];

/* ---------------------------------------------
   ROUTES - PUBLIC
----------------------------------------------*/
// GET / - Get all garages (public)
router.get('/', garageController.getAllGarages);

// GET /:id - Get detail of a garage (public)
router.get('/:id', garageController.getGarageById);

// GET /:id/reviews - Get all reviews for a garage (public)
router.get('/:id/reviews', garageController.getGarageReviews);

/* ---------------------------------------------
   OWNER ROUTES
----------------------------------------------*/
// Create a new garage (owner only)
router.post('/', authenticate, isOwner, garageValidation, garageController.createGarage);

// Get my garages (owner only)
router.get('/owner/my-garages', authenticate, isOwner, garageController.getMyGarages);

// Update garage (owner only)
router.put('/:id', authenticate, isOwner, garageValidation, garageController.updateGarage);

// Delete garage (owner only)
router.delete('/:id', authenticate, isOwner, garageController.deleteGarage);

/* ---------------------------------------------
   ROUTES - RENTER (Penyewa)
----------------------------------------------*/
// GET /favorites - Get favorite garages of renter
router.get('/favorites', authenticate, isRenter, garageController.getFavorites);

// POST /favorites - Add a garage to favorites
router.post('/favorites', authenticate, isRenter, body('garageId').isInt().withMessage('Garage ID is required'), garageController.addFavorite);

// DELETE /favorites/:garageId - Remove a garage from favorites
router.delete('/favorites/:garageId', authenticate, isRenter, garageController.removeFavorite);

/* ---------------------------------------------
   ROUTES - ADMIN
----------------------------------------------*/
// PUT /admin/:id/status - Update garage status (approve, reject, feature)
router.put('/admin/:id/status', authenticate, isAdmin, body('status')
  .isIn(['approved', 'rejected', 'featured'])
  .withMessage('Status must be one of: approved, rejected, featured'), garageController.updateGarageStatus);

module.exports = router;
