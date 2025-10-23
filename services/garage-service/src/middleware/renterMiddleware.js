export const isRenter = (req, res, next) => {
  if (req.user.role !== "renter")
    return res.status(403).json({ message: "Only renter can access" });
  next();
};
