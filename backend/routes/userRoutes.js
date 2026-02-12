const express = require('express');
const { getMe, updateUser, getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { updateUserSchema } = require('../utils/validators');

const router = express.Router();

// All user routes are protected
router.use(protect);

router.get('/me', getMe);
router.put('/update', validate(updateUserSchema), updateUser);
router.get('/admin/users', authorize('admin'), getAllUsers);

module.exports = router;
