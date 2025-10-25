
const isOwner = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check for both 'roles' and 'role' properties in the JWT payload
    const userRoles = req.user.roles || req.user.role;
    const roles = Array.isArray(userRoles)
      ? userRoles
      : [userRoles];

    if (!roles.includes("owner")) {
      return res.status(403).json({
        success: false,
        message: "Owner access required",
      });
    }

    next();
  } catch (error) {
    console.error("Owner Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in owner middleware",
    });
  }
};

module.exports = { isOwner };
