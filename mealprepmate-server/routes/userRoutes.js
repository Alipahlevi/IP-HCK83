const express = require('express');
const UserController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/google-login', UserController.googleLogin); // Tambahkan route ini

// Protected routes (perlu authentication)
router.get('/profile', authenticate, UserController.getProfile);
router.put('/profile', authenticate, UserController.updateProfile);
router.put('/password', authenticate, UserController.updatePassword);

module.exports = router;