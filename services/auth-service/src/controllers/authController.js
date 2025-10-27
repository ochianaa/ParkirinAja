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
  },

  // Get all users (Admin only)
  async getAllUsers(req, res) {
    try {
      // Get all users with their roles
      const usersWithRoles = await db.select({
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
        .orderBy(users.createdAt);

      // Group users with their roles
      const usersMap = new Map();
      
      usersWithRoles.forEach(row => {
        if (!usersMap.has(row.id)) {
          usersMap.set(row.id, {
            id: row.id,
            username: row.username,
            email: row.email,
            phoneNumber: row.phoneNumber,
            address: row.address,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            roles: []
          });
        }
        
        if (row.roleName) {
          usersMap.get(row.id).roles.push(row.roleName);
        }
      });

      const allUsers = Array.from(usersMap.values());

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users: allUsers,
          total: allUsers.length
        }
      });

    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving users'
      });
    }
  },

  // Get specific user by ID (Admin only)
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      // Validate ID is a number
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      // Get user with roles
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
        .where(eq(users.id, parseInt(id)));

      if (userWithRoles.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Format user data with roles
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
        message: 'User retrieved successfully',
        data: {
          user: userData
        }
      });

    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving user'
      });
    }
  },

  // Update user by ID (Admin only)
  async updateUserById(req, res) {
    try {
      const { id } = req.params;
      const { username, email, phoneNumber, address, roles: newRoles } = req.body;

      // Validate ID is a number
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const userId = parseInt(id);

      // Check if user exists
      const [existingUser] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Build update object with only provided fields
      const updateData = {};
      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (address !== undefined) updateData.address = address;

      // Check for duplicate username/email if provided
      if (username || email) {
        const duplicateConditions = [];
        if (username) duplicateConditions.push(eq(users.username, username));
        if (email) duplicateConditions.push(eq(users.email, email));

        const duplicateUsers = await db.select().from(users).where(
          and(
            or(...duplicateConditions),
            // Exclude current user from duplicate check
            eq(users.id, userId)
          )
        );

        // If no results, check if username/email is taken by someone else
        if (duplicateUsers.length === 0) {
          const takenByOthers = await db.select().from(users).where(
            or(...duplicateConditions)
          );
          
          if (takenByOthers.length > 0) {
            return res.status(409).json({
              success: false,
              message: 'Username or email already exists'
            });
          }
        }
      }

      // Update user data if there are changes
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();
        await db.update(users)
          .set(updateData)
          .where(eq(users.id, userId));
      }

      // Update roles if provided
      if (newRoles && Array.isArray(newRoles)) {
        // Remove existing roles
        await db.delete(userRoles).where(eq(userRoles.userId, userId));

        // Add new roles
        for (const roleName of newRoles) {
          const [role] = await db.select().from(roles).where(eq(roles.roleName, roleName));
          
          if (role) {
            await db.insert(userRoles).values({
              userId: userId,
              roleId: role.id
            });
          }
        }
      }

      // Get updated user with roles
      const updatedUserWithRoles = await db.select({
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
        id: updatedUserWithRoles[0].id,
        username: updatedUserWithRoles[0].username,
        email: updatedUserWithRoles[0].email,
        phoneNumber: updatedUserWithRoles[0].phoneNumber,
        address: updatedUserWithRoles[0].address,
        createdAt: updatedUserWithRoles[0].createdAt,
        updatedAt: updatedUserWithRoles[0].updatedAt,
        roles: updatedUserWithRoles.map(row => row.roleName).filter(Boolean)
      };

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
          user: userData
        }
      });

    } catch (error) {
      console.error('Update user by ID error:', error);
      
      // Handle unique constraint errors
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Username or email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while updating user'
      });
    }
  },

  // Get basic user info by ID (Authenticated users only - returns limited info)
  async getUserInfo(req, res) {
    try {
      const { id } = req.params;

      // Validate ID is a number
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      // Get basic user information (no sensitive data)
      const [user] = await db.select({
        id: users.id,
        username: users.username,
        email: users.email
      }).from(users)
        .where(eq(users.id, parseInt(id)));

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User info retrieved successfully',
        data: {
          user: {
            id: user.id,
            username: user.username,
            name: user.username, // Using username as name for compatibility
            email: user.email
          }
        }
      });

    } catch (error) {
      console.error('Get user info error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving user info'
      });
    }
  }
};

module.exports = authController;