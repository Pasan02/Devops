const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth Middleware: No token provided');
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.error('DEBUG_AUTH: Token extracted:', token.substring(0, 10) + '...');

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
      console.error('DEBUG_AUTH: Decoded ID:', decoded.id);
    } catch (e) {
      console.error('DEBUG_AUTH: JWT Verify Failed:', e.message);
      throw e; 
    }
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.error('DEBUG_AUTH: User not found for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'Token is not valid - User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = authMiddleware;
