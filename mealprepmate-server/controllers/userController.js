const { User } = require('../models');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      const hashedPassword = hashPassword(password);
      
      const user = await User.create({
        username,
        email,
        password: hashedPassword
      });
      
      const token = signToken({ id: user.id, email: user.email });
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      const user = await User.findOne({ where: { email } });
      
      if (!user || !comparePassword(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = signToken({ id: user.id, email: user.email });
      
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;