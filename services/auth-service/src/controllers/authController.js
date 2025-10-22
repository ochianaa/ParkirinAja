const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { db, users, roles, userRoles } = require('../db');
const { eq, and, or } = require('drizzle-orm');

const authController = {
  // Register new users
  async register(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { username, email, password, phoneNumber, address, role } = req.body;

      // Check if user already exists
      const existingUser = await db.select().from(users).where(
        or(eq(users.email, email), eq(users.username, username))
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const [newUser] = await db.insert(users).values({
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        address
      }).returning();

      // Find role (default to 'renter' if not specified)
      // Explicitly prevent admin role creation through public registration
      const userRole = role || 'renter';
      
      if (userRole === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin role cannot be assigned through public registration'
        });
      }

      const [roleRecord] = await db.select().from(roles).where(eq(roles.roleName, userRole));

      if (!roleRecord) {
        return res.status(400).json({
          success: false,
          message: `Role '${userRole}' not found`
        });
      }

      // Assign role to user
      await db.insert(userRoles).values({
        userId: newUser.id,
        roleId: roleRecord.id
      });

      // Fetch user with roles for response
      const userWithRoles = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        phoneNumber: users.phoneNumber,
        address: users.address,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        roles: roles.roleName
      }).from(users)
        .leftJoin(userRoles, eq(users.id, userRoles.userId))
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(users.id, newUser.id));

      // Group roles for the user
      const userData = {
        id: userWithRoles[0].id,
        username: userWithRoles[0].username,
        email: userWithRoles[0].email,
        phoneNumber: userWithRoles[0].phoneNumber,
        address: userWithRoles[0].address,
        createdAt: userWithRoles[0].createdAt,
        updatedAt: userWithRoles[0].updatedAt,
        Roles: userWithRoles.map(row => ({ roleName: row.roles })).filter(role => role.roleName)
      };

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userData
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle unique constraint errors
      if (error.code === '23505') { // PostgreSQL unique violation
        return res.status(409).json({
          success: false,
          message: 'Email or username already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  },

  // Login user
  async login(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user with roles
      const userWithRoles = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        phoneNumber: users.phoneNumber,
        address: users.address,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        roleName: roles.roleName
      }).from(users)
        .leftJoin(userRoles, eq(users.id, userRoles.userId))
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(users.email, email));

      if (userWithRoles.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const user = userWithRoles[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Extract user roles
      const userRoleNames = userWithRoles
        .map(row => row.roleName)
        .filter(roleName => roleName);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          username: user.username,
          roles: userRoleNames
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            roles: userRoleNames
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  },

  // Logout user (stateless JWT - just return success)
  async logout(req, res) {
    try {
      // Since we're using stateless JWT, we just return success
      // In a production app, you might want to implement token blacklisting
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during logout'
      });
    }
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      // User info is already attached by authMiddleware
      const user = req.user;

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving profile'
      });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const { username, phoneNumber, address, currentPassword, newPassword } = req.body;

      // Build update object with only provided fields
      const updateData = {};
      if (username !== undefined) updateData.username = username;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (address !== undefined) updateData.address = address;

      // Handle password update if provided
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: 'Current password is required to update password'
          });
        }

        // Get current user password
        const [currentUser] = await db.select({ password: users.password })
          .from(users)
          .where(eq(users.id, userId));

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
        if (!isCurrentPasswordValid) {
          return res.status(400).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }

        // Hash new password
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(newPassword, saltRounds);
      }

      // Check if username is already taken by another user
      if (username) {
        const existingUser = await db.select().from(users).where(
          and(eq(users.username, username), eq(users.id, userId))
        );

        if (existingUser.length === 0) {
          // Check if username is taken by someone else
          const usernameTaken = await db.select().from(users).where(eq(users.username, username));
          if (usernameTaken.length > 0) {
            return res.status(409).json({
              success: false,
              message: 'Username is already taken'
            });
          }
        }
      }

      // Update user
      updateData.updatedAt = new Date();
      const [updatedUser] = await db.update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning();

      // Get updated user with roles
      const userWithRoles = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        phoneNumber: users.phoneNumber,
        address: users.address,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        roleName: roles.roleName
      }).from(users)
        .leftJoin(userRoles, eq(users.id, userRoles.userId))
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(users.id, userId));

      const userData = {
        id: userWithRoles[0].id,
        username: userWithRoles[0].username,
        email: userWithRoles[0].email,
        phoneNumber: userWithRoles[0].phoneNumber,
        address: userWithRoles[0].address,
        createdAt: userWithRoles[0].createdAt,
        updatedAt: userWithRoles[0].updatedAt,
        roles: userWithRoles.map(row => row.roleName).filter(Boolean)
      };

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: userData
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      
      // Handle unique constraint errors
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Username already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while updating profile'
      });
    }
  },

  // Register admin user (only accessible by existing admins)
  async registerAdmin(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { username, email, password, phoneNumber, address } = req.body;

      // Check if user already exists
      const existingUser = await db.select().from(users).where(
        or(eq(users.email, email), eq(users.username, username))
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const [newUser] = await db.insert(users).values({
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        address
      }).returning();

      // Find admin role
      const [adminRole] = await db.select().from(roles).where(eq(roles.roleName, 'admin'));

      if (!adminRole) {
        return res.status(500).json({
          success: false,
          message: 'Admin role not found in system'
        });
      }

      // Assign admin role to user
      await db.insert(userRoles).values({
        userId: newUser.id,
        roleId: adminRole.id
      });

      // Fetch user with roles for response
      const userWithRoles = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        phoneNumber: users.phoneNumber,
        address: users.address,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        roles: roles.roleName
      }).from(users)
        .leftJoin(userRoles, eq(users.id, userRoles.userId))
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(users.id, newUser.id));

      // Group roles for the user
      const userData = {
        id: userWithRoles[0].id,
        username: userWithRoles[0].username,
        email: userWithRoles[0].email,
        phoneNumber: userWithRoles[0].phoneNumber,
        address: userWithRoles[0].address,
        createdAt: userWithRoles[0].createdAt,
        updatedAt: userWithRoles[0].updatedAt,
        roles: userWithRoles.map(row => row.roles).filter(role => role)
      };

      res.status(201).json({
        success: true,
        message: 'Admin user registered successfully',
        data: {
          user: userData
        }
      });

    } catch (error) {
      console.error('Admin registration error:', error);
      
      // Handle unique constraint errors
      if (error.code === '23505') { // PostgreSQL unique violation
        return res.status(409).json({
          success: false,
          message: 'Email or username already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error during admin registration'
      });
    }
  }
};

module.exports = authController;