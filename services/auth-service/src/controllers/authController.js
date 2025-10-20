const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { db, users, roles, userRoles } = require('../../db');
const { eq, and, or } = require('drizzle-orm');

const authController = {
  // Register new user
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
      const userRole = role || 'renter';
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
  }
};

module.exports = authController;