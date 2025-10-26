
const { db, garages } = require('../db');
const { eq } = require('drizzle-orm');

const Garage = {
  // Find all garages
  findAll: async () => {
    return await db.select().from(garages);
  },

  // Find garage by ID
  findByPk: async (id) => {
    const result = await db.select().from(garages).where(eq(garages.garage_id, id));
    return result[0] || null;
  },

  // Create new garage
  create: async (garageData) => {
    const result = await db.insert(garages).values(garageData).returning();
    return result[0];
  },

  // Update garage
  update: async (id, updateData) => {
    const result = await db.update(garages)
      .set({ ...updateData, updated_at: new Date() })
      .where(eq(garages.garage_id, id))
      .returning();
    return result[0];
  },

  // Delete garage
  delete: async (id) => {
    const result = await db.delete(garages).where(eq(garages.garage_id, id)).returning();
    return result[0];
  },

  // Find garages by owner
  findByOwner: async (ownerId) => {
    return await db.select().from(garages).where(eq(garages.owner_id, ownerId));
  }
};

module.exports = Garage;
