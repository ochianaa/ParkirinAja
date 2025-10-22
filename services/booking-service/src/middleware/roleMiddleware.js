const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.role) {
        return res.status(401).json({ message: "Unauthorized: user not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: access denied" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking role", error: error.message });
    }
  };
};

module.exports = roleMiddleware;
