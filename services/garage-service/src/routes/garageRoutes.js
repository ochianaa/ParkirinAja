


const express = require('express');
const { body } = require('express-validator');
const garageController = require('../controllers/garageController');

// Middlewares (aligned names)
const { authMiddleware: authenticate } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { ownerMiddleware } = require('../middleware/ownerMiddleware');
const { renterMiddleware } = require('../middleware/renterMiddleware');

const router = express.Router();

/* ---------------------------------------------
   VALIDATION RULES
----------------------------------------------*/
const validateGarage = (req, res, next) => {
  const { name, address, pricePerHour, status } = req.body || {};
  const errors = [];

  if (typeof name !== 'string' || name.trim().length < 3) {
    errors.push({ param: 'name', msg: 'Garage name must be at least 3 characters long' });
  }
  if (typeof address !== 'string' || address.trim().length < 5) {
    errors.push({ param: 'address', msg: 'Address must be at least 5 characters long' });
  }
  if (pricePerHour === undefined || Number.isNaN(Number(pricePerHour))) {
    errors.push({ param: 'pricePerHour', msg: 'Price per hour must be a number' });
  }
  if (status !== undefined && !['available', 'unavailable'].includes(status)) {
    errors.push({ param: 'status', msg: 'Status must be either available or unavailable' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }
  next();
};

const validateFavoritePayload = (req, res, next) => {
  const { garageId } = req.body || {};
  if (garageId === undefined || Number.isNaN(Number(garageId))) {
    return res.status(422).json({ errors: [{ param: 'garageId', msg: 'Garage ID is required' }] });
  }
  next();
};

const validateAdminStatus = (req, res, next) => {
  const { status } = req.body || {};
  const allowed = ['approved', 'rejected', 'featured'];
  if (!allowed.includes(status)) {
    return res.status(422).json({ errors: [{ param: 'status', msg: 'Status must be one of: approved, rejected, featured' }] });
  }
  next();
};

/* ---------------------------------------------
   ROUTES - PUBLIC (Publik)
----------------------------------------------*/
// GET / - Get all garages
router.get('/', garageController.getAllGarages);

/* ---------------------------------------------
   ROUTES - OWNER (Pemilik)
----------------------------------------------*/
// POST / - Create a new garage
router.post('/', authenticate, ownerMiddleware, validateGarage, garageController.createGarage);

// GET /owner/my-garages - Get garages owned by the authenticated user
router.get('/owner/my-garages', authenticate, ownerMiddleware, garageController.getMyGarages);

/* ---------------------------------------------
   ROUTES - RENTER (Penyewa)
----------------------------------------------*/
// GET /favorites - Get favorite garages of renter
router.get('/favorites', authenticate, renterMiddleware, garageController.getFavorites);

// POST /favorites - Add a garage to favorites
router.post('/favorites', authenticate, renterMiddleware, validateFavoritePayload, garageController.addFavorite);

// DELETE /favorites/:garageId - Remove a garage from favorites
router.delete('/favorites/:garageId', authenticate, renterMiddleware, garageController.removeFavorite);

/* ---------------------------------------------
   ROUTES - PUBLIC (Publik) - Parameterized routes (must come after specific routes)
----------------------------------------------*/
// GET /:id - Get garage by ID
router.get('/:id', garageController.getGarageById);

// GET /:id/reviews - Get reviews for a garage
router.get('/:id/reviews', garageController.getGarageReviews);

// PUT /:id - Update a garage
router.put('/:id', authenticate, ownerMiddleware, validateGarage, garageController.updateGarage);

// DELETE /:id - Delete a garage
router.delete('/:id', authenticate, ownerMiddleware, garageController.deleteGarage);

/* ---------------------------------------------
   ROUTES - ADMIN
----------------------------------------------*/
// PUT /admin/garages/:id/status - Update garage status (approve, reject, feature)
router.put('/admin/garages/:id/status', authenticate, adminMiddleware, validateAdminStatus, garageController.updateGarageStatus);

module.exports = router;
