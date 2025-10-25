
const express = require('express');
const { body } = require('express-validator');
const garageController = require('../controllers/garageController');

// Middlewares (aligned names)
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { ownerMiddleware } = require('../middleware/ownerMiddleware');
const { renterMiddleware } = require('../middleware/renterMiddleware');

const router = express.Router();

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
  body('pricePerHour')
    .isNumeric()
    .withMessage('Price per hour must be a number'),
  body('status')
    .optional()
    .isIn(['available', 'unavailable'])
    .withMessage('Status must be either available or unavailable'),
];

/* ---------------------------------------------
   ROUTES - PUBLIC
----------------------------------------------*/
// GET /garages - Get all garages (public)
router.get('/garages', garageController.getAllGarages);

// GET /garages/:id - Get detail of a garage (public)
router.get('/garages/:id', garageController.getGarageById);

// Optional: reviews stub
router.get('/garages/:id/reviews', garageController.getGarageReviews);

/* ---------------------------------------------
   ROUTES - OWNER (Pemilik)
----------------------------------------------*/
// POST /garages - Add new garage
router.post('/garages', authMiddleware, ownerMiddleware, garageValidation, garageController.createGarage);

// GET /owner/my-garages - Get list of owner's garages
router.get('/owner/my-garages', authMiddleware, ownerMiddleware, garageController.getMyGarages);

// PUT /garages/:id - Update garage details
router.put('/garages/:id', authMiddleware, ownerMiddleware, garageValidation, garageController.updateGarage);

// DELETE /garages/:id - Delete a garage
router.delete('/garages/:id', authMiddleware, ownerMiddleware, garageController.deleteGarage);

/* ---------------------------------------------
   ROUTES - RENTER (Penyewa)
----------------------------------------------*/
// GET /favorites - Get favorite garages of renter
router.get('/favorites', authMiddleware, renterMiddleware, garageController.getFavorites);

// POST /favorites - Add a garage to favorites
router.post('/favorites', authMiddleware, renterMiddleware, body('garageId').isInt().withMessage('Garage ID is required'), garageController.addFavorite);

// DELETE /favorites/:garageId - Remove a garage from favorites
router.delete('/favorites/:garageId', authMiddleware, renterMiddleware, garageController.removeFavorite);

/* ---------------------------------------------
   ROUTES - ADMIN
----------------------------------------------*/
// PUT /admin/garages/:id/status - Update garage status (approve, reject, feature)
router.put('/admin/garages/:id/status', authMiddleware, adminMiddleware, body('status')
  .isIn(['approved', 'rejected', 'featured'])
  .withMessage('Status must be one of: approved, rejected, featured'), garageController.updateGarageStatus);

module.exports = router;
