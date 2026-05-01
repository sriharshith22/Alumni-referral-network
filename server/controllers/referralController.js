const ReferralRequest = require('../models/ReferralRequest');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

const createReferralRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { alumniId, jobTitle, company, jobURL, message } = req.body;
    const existingRequest = await ReferralRequest.findOne({
      studentId: req.user._id,
      alumniId,
      status: 'pending'
    });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request with this alumni' });
    }
    const referral = await ReferralRequest.create({
      studentId: req.user._id,
      alumniId,
      jobTitle,
      company,
      jobURL,
      message
    });
    await Notification.create({
      userId: alumniId,
      type: 'referral_request',
      message: `You have a new referral request from ${req.user.name}`,
      link: `/referrals/incoming`
    });
    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyReferralRequests = async (req, res) => {
  try {
    const requests = await ReferralRequest.find({ studentId: req.user._id })
      .populate('alumniId', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    const requests = await ReferralRequest.find({ alumniId: req.user._id })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReferralStatus = async (req, res) => {
  try {
    const { status, alumniResponse } = req.body;
    const referral = await ReferralRequest.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({ message: 'Referral request not found' });
    }
    if (referral.alumniId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    referral.status = status;
    referral.alumniResponse = alumniResponse || '';
    await referral.save();
    await Notification.create({
      userId: referral.studentId,
      type: `referral_${status}`,
      message: `Your referral request for ${referral.jobTitle} at ${referral.company} has been ${status}`,
      link: `/referrals/my-requests`
    });
    res.json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReferralRequest, getMyReferralRequests, getIncomingRequests, updateReferralStatus };