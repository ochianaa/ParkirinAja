const bcrypt = require('bcrypt');
const { User } = require('../../models');
const { Op } = require('sequelize');

const authController = {
  // Register new user
  async register(req, res) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required'
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

      // Return success response (password is automatically excluded by toJSON method)
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser
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
  }
};

module.exports = authController;