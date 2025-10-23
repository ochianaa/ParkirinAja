const express = require("express");
const { body, param } = require("express-validator");

const garageController = require("../controllers/garageController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const ownerMiddleware = require("../middleware/ownerMiddleware");
const renterMiddleware = require("../middleware/renterMiddleware");

const router = express.Router();

/**
 * @route   GET /api/garage/health
 * @desc    Health check for garage service
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "garage-service" });
});

/**
 * @route   POST /api/garage
 * @desc    Create a new garage (Owner Only)
 * @access  Private (Owner)
 */
router.post(
  "/",
  authMiddleware,
  ownerMiddleware,
  [
    body("name")
      .notEmpty()
      .withMessage("Garage name is required")
      .isLength({ max: 100 })
      .withMessage("Garage name must not exceed 100 characters"),
    body("address")
      .notEmpty()
      .withMessage("Garage address is required"),
    body("description")
      .optional()
      .isLength({ max: 255 })
      .withMessage("Description must not exceed 255 characters"),
    body("price_per_hour")
      .isNumeric()
      .withMessage("Price per hour must be a number"),
  ],
  garageController.createGarage
);

/**
 * @route   GET /api/garage
 * @desc    Get all available garages
 * @access  Public
 */
router.get("/", garageController.getAllGarages);

/**
 * @route   GET /api/garage/:id
 * @desc    Get garage details by ID
 * @access  Public
 */
router.get(
  "/:id",
  [param("id").isInt().withMessage("Garage ID must be an integer")],
  garageController.getGarageById
);

/**
 * @route   PUT /api/garage/:id
 * @desc    Update garage details (Owner Only)
 * @access  Private (Owner)
 */
router.put(
  "/:id",
  authMiddleware,
  ownerMiddleware,
  [
    param("id").isInt().withMessage("Garage ID must be an integer"),
    body("name").optional().isString(),
    body("address").optional().isString(),
    body("description").optional().isString(),
    body("price_per_hour")
      .optional()
      .isNumeric()
      .withMessage("Price per hour must be a number"),
    body("status")
      .optional()
      .isIn(["available", "unavailable"])
      .withMessage("Status must be 'available' or 'unavailable'"),
  ],
  garageController.updateGarage
);

/**
 * @route   DELETE /api/garage/:id
 * @desc    Delete a garage (Owner or Admin)
 * @access  Private (Owner/Admin)
 */
router.delete(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    // Middleware gabungan: boleh Owner atau Admin
    if (req.user.role === "owner" || req.user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Access denied. Owner or Admin only." });
    }
  },
  [param("id").isInt().withMessage("Garage ID must be an integer")],
  garageController.deleteGarage
);

/**
 * @route   POST /api/garage/:id/book
 * @desc    Book a garage (Renter Only)
 * @access  Private (Renter)
 */
router.post(
  "/:id/book",
  authMiddleware,
  renterMiddleware,
  [
    param("id").isInt().withMessage("Garage ID must be an integer"),
    body("hours")
      .isInt({ min: 1 })
      .withMessage("Booking duration (hours) must be at least 1"),
  ],
  garageController.bookGarage
);

module.exports = router;
