
const Garage = require("../models/garageModel");
const { validationResult } = require("express-validator");

// (Publik)
const getAllGarages = async (req, res) => {
  try {
    const garages = await Garage.findAll();
    res.json(garages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Publik)
const getGarageById = async (req, res) => {
  try {
    const garage = await Garage.findByPk(req.params.id);
    if (!garage) return res.status(404).json({ message: "Garage not found" });
    res.json(garage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Owner)
const createGarage = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, address, description, pricePerHour, price_per_hour, status } = req.body;
    
    // Handle both camelCase and snake_case for price
    const finalPrice = price_per_hour || pricePerHour;
    
    const garageData = {
      owner_id: req.user.userId,
      name,
      address,
      description,
      price_per_hour: finalPrice,
      status: status || 'available'
    };
    
    const garage = await Garage.create(garageData);
    res.status(201).json({
      success: true,
      message: 'Garage created successfully',
      data: garage
    });
  } catch (err) {
    console.error('Create garage error:', err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// (Owner)
const getMyGarages = async (req, res) => {
  try {
    const garages = await Garage.findByOwner(req.user.userId);
    res.json({
      success: true,
      data: garages
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// (Owner)
const updateGarage = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const garage = await Garage.findByPk(req.params.id);
    if (!garage) return res.status(404).json({ message: "Garage not found" });
    if (garage.owner_id !== req.user.userId) return res.status(403).json({ message: "Forbidden" });
    
    const { name, address, description, pricePerHour, price_per_hour, status } = req.body;
    const finalPrice = price_per_hour || pricePerHour;
    
    const updateData = {
      ...(name && { name }),
      ...(address && { address }),
      ...(description && { description }),
      ...(finalPrice && { price_per_hour: finalPrice }),
      ...(status && { status })
    };
    
    const updatedGarage = await Garage.update(req.params.id, updateData);
    res.json({
      success: true,
      message: 'Garage updated successfully',
      data: updatedGarage
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// (Pemilik)
const deleteGarage = async (req, res) => {
  try {
    const garage = await Garage.findByPk(req.params.id);
    if (!garage || garage.owner_id !== req.user.userId)
      return res.status(403).json({ message: "Unauthorized" });
    
    await Garage.delete(req.params.id);
    res.json({ 
      success: true,
      message: "Garage deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// (Admin)
const updateGarageStatus = async (req, res) => {
  try {
    const garage = await Garage.findByPk(req.params.id);
    if (!garage) return res.status(404).json({ message: "Garage not found" });
    
    const updatedGarage = await Garage.update(req.params.id, { status: req.body.status });
    res.json({
      success: true,
      message: 'Garage status updated successfully',
      data: updatedGarage
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Missing functions that are referenced in routes but not implemented
const getGarageReviews = async (req, res) => {
  res.status(501).json({ message: "Reviews feature not implemented yet" });
};

const getFavorites = async (req, res) => {
  res.status(501).json({ message: "Favorites feature not implemented yet" });
};

const addFavorite = async (req, res) => {
  res.status(501).json({ message: "Add favorite feature not implemented yet" });
};

const removeFavorite = async (req, res) => {
  res.status(501).json({ message: "Remove favorite feature not implemented yet" });
};

module.exports = {
  getAllGarages,
  getGarageById,
  createGarage,
  getMyGarages,
  updateGarage,
  deleteGarage,
  updateGarageStatus,
  getGarageReviews,
  getFavorites,
  addFavorite,
  removeFavorite
};
