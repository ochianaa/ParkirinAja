

const Garage = require("../models/garageModel.js");
const { db, favorites, garages } = require("../db");
const { eq, and } = require("drizzle-orm");

// (Publik)
const getAllGarages = async (req, res) => {
  try {
    const all = await Garage.findAll();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Publik)
const getGarageById = async (req, res) => {
  try {
    const idParam = req.params.id;
    const idNum = Number(idParam);
    if (!Number.isInteger(idNum)) {
      return res.status(400).json({ error: "Invalid garage id" });
    }
    const garage = await Garage.findByPk(idNum);
    if (!garage) return res.status(404).json({ message: "Garage not found" });
    res.json(garage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional stub for reviews to prevent router binding errors
const getGarageReviews = async (req, res) => {
  res.json([]);
};

// (Pemilik)
const createGarage = async (req, res) => {
  try {
    const ownerId = req.user?.userId ?? req.user?.id;
    if (!ownerId) return res.status(401).json({ error: "Unauthorized" });
    
    // Map camelCase to snake_case for database
    const garageData = {
      owner_id: ownerId,
      name: req.body.name,
      address: req.body.address,
      description: req.body.description,
      price_per_hour: req.body.pricePerHour,
      status: req.body.status || 'available',
      image_url: req.body.image_url || null,
    };
    
    const newGarage = await Garage.create(garageData);
    res.status(201).json(newGarage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// (Pemilik)
const getMyGarages = async (req, res) => {
  try {
    const ownerId = req.user?.userId ?? req.user?.id;
    if (!ownerId) return res.status(401).json({ error: "Unauthorized" });
    const list = await Garage.findByOwner(ownerId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Pemilik)
const updateGarage = async (req, res) => {
  try {
    const ownerId = req.user?.userId ?? req.user?.id;
    if (!ownerId) return res.status(401).json({ error: "Unauthorized" });
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum)) return res.status(400).json({ error: "Invalid garage id" });
    const garage = await Garage.findByPk(idNum);
    if (!garage || garage.owner_id !== ownerId)
      return res.status(403).json({ message: "Unauthorized" });
    
    // Map camelCase to snake_case for database
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.address !== undefined) updateData.address = req.body.address;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.pricePerHour !== undefined) updateData.price_per_hour = req.body.pricePerHour;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.image_url !== undefined) updateData.image_url = req.body.image_url;
    
    const updated = await Garage.update(idNum, updateData);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// (Pemilik)
const deleteGarage = async (req, res) => {
  try {
    const ownerId = req.user?.userId ?? req.user?.id;
    if (!ownerId) return res.status(401).json({ error: "Unauthorized" });
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum)) return res.status(400).json({ error: "Invalid garage id" });
    const garage = await Garage.findByPk(idNum);
    if (!garage || garage.owner_id !== ownerId)
      return res.status(403).json({ message: "Unauthorized" });
    await Garage.delete(idNum);
    res.json({ message: "Garage deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// (Admin)
const updateGarageStatus = async (req, res) => {
  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum)) return res.status(400).json({ error: "Invalid garage id" });
    const garage = await Garage.findByPk(idNum);
    if (!garage) return res.status(404).json({ message: "Garage not found" });
    const updated = await Garage.update(idNum, { status: req.body.status });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// (Renter) - Favorites
const getFavorites = async (req, res) => {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const result = await db
      .select()
      .from(favorites)
      .innerJoin(garages, eq(favorites.garage_id, garages.garage_id))
      .where(eq(favorites.user_id, userId));

    const favoriteGarages = result.map((row) => row.garages);
    res.json(favoriteGarages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const garageId = Number(req.body.garageId ?? req.params.garageId);
    if (!Number.isInteger(garageId)) return res.status(400).json({ error: "Invalid garage id" });

    const existingGarage = await db.select().from(garages).where(eq(garages.garage_id, garageId));
    if (existingGarage.length === 0) return res.status(404).json({ error: "Garage not found" });

    try {
      const inserted = await db
        .insert(favorites)
        .values({ user_id: userId, garage_id: garageId })
        .returning();
      res.status(201).json(inserted[0]);
    } catch (e) {
      // Handle duplicate favorites gracefully
      if (e && e.code === '23505') {
        return res.status(200).json({ message: 'Already favorited' });
      }
      throw e;
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const garageId = Number(req.params.garageId);
    if (!Number.isInteger(garageId)) return res.status(400).json({ error: "Invalid garage id" });

    const deleted = await db
      .delete(favorites)
      .where(and(eq(favorites.user_id, userId), eq(favorites.garage_id, garageId)))
      .returning();

    if (!deleted || deleted.length === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllGarages,
  getGarageById,
  getGarageReviews,
  createGarage,
  getMyGarages,
  updateGarage,
  deleteGarage,
  updateGarageStatus,
  getFavorites,
  addFavorite,
  removeFavorite,
};
