
const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const rawRoles = req.user.roles ?? req.user.role;
    const roles = Array.isArray(rawRoles) ? rawRoles : (rawRoles ? [rawRoles] : []);

    if (!roles.includes("admin")) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in admin middleware",
    });
  }
};

module.exports = { adminMiddleware };
