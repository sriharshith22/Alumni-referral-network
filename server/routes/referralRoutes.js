const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('student'), referralController.createReferralRequest);
router.get('/my-requests', protect, authorizeRoles('student'), referralController.getMyReferralRequests);
router.get('/incoming', protect, authorizeRoles('alumni'), referralController.getIncomingRequests);
router.put('/:id/status', protect, authorizeRoles('alumni'), referralController.updateReferralStatus);

module.exports = router;