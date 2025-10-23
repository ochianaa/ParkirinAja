import { Router } from "express";
import {
  getAllGarages,
  getGarageById,
  createGarage,
  getMyGarages,
  updateGarage,
  deleteGarage,
  updateGarageStatus,
} from "../controllers/garageController.js";

import { authenticate } from "../middlewares/authMiddleware.js";
import { isOwner } from "../middlewares/ownerMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/garages", getAllGarages);
router.get("/garages/:id", getGarageById);

router.post("/garages", authenticate, isOwner, createGarage);
router.get("/owner/my-garages", authenticate, isOwner, getMyGarages);
router.put("/garages/:id", authenticate, isOwner, updateGarage);
router.delete("/garages/:id", authenticate, isOwner, deleteGarage);

router.put("/admin/garages/:id/status", authenticate, isAdmin, updateGarageStatus);

export default router;
