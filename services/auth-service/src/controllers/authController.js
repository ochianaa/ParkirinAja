const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../../models');
const { Op } = require('sequelize');

const authController = {
  // Register new user
  async register(req, res) {
    try {
      const { username, email, password, phoneNumber, address, role } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required'
        });
      }

      // Validate role if provided
      const allowedRoles = ['renter', 'owner', 'admin'];
      const userRole = role || 'renter'; // Default to 'renter' if not specified

      if (!allowedRoles.includes(userRole)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Allowed roles are: renter, owner, admin'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { username: username }
          ]
        }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }

      // Find the role
      const roleRecord = await Role.findOne({
        where: { roleName: userRole }
      });

      if (!roleRecord) {
        return res.status(500).json({
          success: false,
          message: 'Role configuration error'
        });
      }

      // Hash password
      const saltRounds = 8;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        phoneNumber: phoneNumber || null,
        address: address || null
      });

      // Assign role to user
      await newUser.addRole(roleRecord);

      // Fetch user with roles for response
      const userWithRoles = await User.findByPk(newUser.id, {
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'roleName']
        }]
      });

      // Return success response (password is automatically excluded by toJSON method)
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userWithRoles
        }
      });

    } catch (error) {
      console.error('Registration error:', error);

      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      // Handle Sequelize unique constraint errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }

      // Generic error response
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user by email with roles
      const user = await User.findOne({
        where: { email: email },
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'roleName']
        }]
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Extract role names for JWT token
      const userRoles = user.roles.map(role => role.roleName);

      // Generate JWT token with roles
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          username: user.username,
          roles: userRoles
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return success response with token and user data including roles
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token: token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            roles: user.roles
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);

      // Generic error response
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  }
};

module.exports = authController;