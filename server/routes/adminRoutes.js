const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  approveAlumni,
  rejectAlumni,
  getDashboardStats,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.put('/approve/:id', protect, authorizeRoles('admin'), approveAlumni);
router.put('/reject/:id', protect, authorizeRoles('admin'), rejectAlumni);
router.get('/stats', protect, authorizeRoles('admin'), getDashboardStats);
router.delete('/user/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;