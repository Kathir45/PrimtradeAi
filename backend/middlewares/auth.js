const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Protect routes — verifies JWT from cookie or Authorization header.
 * Attaches the authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check httpOnly cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback to Authorization: Bearer <token>
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized — no token provided');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'User belonging to this token no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token has expired, please login again'));
    }
    next(error);
  }
};

/**
 * Role-based authorization middleware.
 * @param  {...string} roles - allowed roles
 */
const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden — insufficient permissions'));
  }
  return next();
};

module.exports = { protect, authorize };
