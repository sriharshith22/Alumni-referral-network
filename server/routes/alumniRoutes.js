const express = require('express');
const router = express.Router();
const {
  createProfile,
  getAllAlumni,
  getAlumniById,
  updateProfile,
  toggleWillingToRefer
} = require('../controllers/alumniController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/profile', protect, authorizeRoles('alumni'), createProfile);
router.get('/', protect, getAllAlumni);
router.get('/:id', protect, getAlumniById);
router.put('/profile', protect, authorizeRoles('alumni'), updateProfile);
router.put('/toggle-refer', protect, authorizeRoles('alumni'), toggleWillingToRefer);

module.exports = router;