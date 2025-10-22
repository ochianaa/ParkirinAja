const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { users, roles, userRoles } = require('../db/schema');
const { eq } = require('drizzle-orm');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user with roles from database
    const userWithRoles = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        phoneNumber: users.phoneNumber,
        address: users.address,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        roleName: roles.roleName
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(users.id, decoded.userId));

    if (!userWithRoles || userWithRoles.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    // Attach user info to request object
    req.user = {
      id: userWithRoles[0].id,
      username: userWithRoles[0].username,
      email: userWithRoles[0].email,
      phoneNumber: userWithRoles[0].phoneNumber,
      address: userWithRoles[0].address,
      createdAt: userWithRoles[0].createdAt,
      updatedAt: userWithRoles[0].updatedAt,
      roles: userWithRoles.map(row => row.roleName).filter(Boolean)
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = authMiddleware;