const express = require('express');
const { getUsers, getUser, deleteUser, createUser, updateUser, getAdminStats } = require('../controllers/userController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin only routes
router.use(protect);
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
