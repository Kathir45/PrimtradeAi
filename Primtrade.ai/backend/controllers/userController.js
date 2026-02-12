const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/user/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile (name/email)
 * @route   PUT /api/user/update
 * @access  Private
 */
const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // If updating email, check for conflicts
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(409, 'This email is already in use');
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(email && { email }) },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/user/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select('-password -__v');
    res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, updateUser, getAllUsers };
