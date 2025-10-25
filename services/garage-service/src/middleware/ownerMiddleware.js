export const ownerMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const roles = Array.isArray(req.user.role)
      ? req.user.role
      : [req.user.role];

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
