const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.roles) {
        return res.status(401).json({ message: "Unauthorized: user not found" });
      }

      // Check if user has any of the allowed roles
      const hasAllowedRole = user.roles.some(role => allowedRoles.includes(role));
      
      if (!hasAllowedRole) {
        return res.status(403).json({ message: "Forbidden: access denied" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking role", error: error.message });
    }
  };
};

module.exports = roleMiddleware;