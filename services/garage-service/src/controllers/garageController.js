import Garage from "../models/garageModel.js";

// (Publik)
export const getAllGarages = async (req, res) => {
  try {
    const garages = await Garage.findAll();
    res.json(garages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Publik)
export const getGarageById = async (req, res) => {
  try {
    const garage = await Garage.findByPk(req.params.id);
    if (!garage) return res.status(404).json({ message: "Garage not found" });
    res.json(garage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Pemilik)
export const createGarage = async (req, res) => {
  try {
    const newGarage = await Garage.create({ ...req.body, owner_id: req.user.id });
    res.status(201).json(newGarage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// (Pemilik)
export const getMyGarages = async (req, res) => {
  try {
    const garages = await Garage.findAll({ where: { owner_id: req.user.id } });
    res.json(garages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Pemilik)
export const updateGarage = async (req, res) => {
  try {
    const garage = await Garage.findByPk(req.params.id);
    if (!garage || garage.owner_id !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });
    await garage.update(req.body);
    res.json(garage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// (Pemilik)
export const deleteGarage = async (req, res) => {
  try {
    const garage = await Garage.findByPk(req.params.id);
    if (!garage || garage.owner_id !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });
    await garage.destroy();
    res.json({ message: "Garage deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// (Admin)
export const updateGarageStatus = async (req, res) => {
  try {
    const garage = await Garage.findByPk(req.params.id);
    if (!garage) return res.status(404).json({ message: "Garage not found" });
    garage.status = req.body.status;
    await garage.save();
    res.json(garage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
