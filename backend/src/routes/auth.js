const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  logout,
  deleteAccount,
} = require('../controllers/authController');

const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', logout);

// Protected routes
router.use(authMiddleware); // Apply auth middleware to all routes below

router.get('/me', getMe);
router.put('/me', validateProfileUpdate, updateDetails);
router.put('/updatepassword', updatePassword);
router.delete('/me', deleteAccount);

module.exports = router;
