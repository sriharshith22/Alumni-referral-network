const User = require('../models/User');
const AlumniProfile = require('../models/AlumniProfile');
const ReferralRequest = require('../models/ReferralRequest');
const Notification = require('../models/Notification');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveAlumni = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isApproved = true;
    await user.save();
    await Notification.create({
      userId: user._id,
      type: 'profile_approved',
      message: 'Your alumni profile has been approved. You can now receive referral requests.',
      link: '/alumni/dashboard'
    });
    res.json({ message: 'Alumni approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectAlumni = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isApproved = false;
    await user.save();
    res.json({ message: 'Alumni rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const pendingApprovals = await User.countDocuments({ role: 'alumni', isApproved: false });
    const totalReferrals = await ReferralRequest.countDocuments();
    const pendingReferrals = await ReferralRequest.countDocuments({ status: 'pending' });
    const acceptedReferrals = await ReferralRequest.countDocuments({ status: 'accepted' });
    const referredReferrals = await ReferralRequest.countDocuments({ status: 'referred' });
    res.json({
      totalUsers,
      totalStudents,
      totalAlumni,
      pendingApprovals,
      totalReferrals,
      pendingReferrals,
      acceptedReferrals,
      referredReferrals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    await AlumniProfile.findOneAndDelete({ userId: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, approveAlumni, rejectAlumni, getDashboardStats, deleteUser };