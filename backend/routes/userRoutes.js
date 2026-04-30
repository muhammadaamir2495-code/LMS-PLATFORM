const express = require('express');
const { getUsers, getUser, deleteUser, createUser, updateUser, getAdminStats, updateProfile } = require('../controllers/userController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected but non-admin routes
router.use(protect);
router.put('/profile', updateProfile);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);
router.route('/stats').get(getAdminStats);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
