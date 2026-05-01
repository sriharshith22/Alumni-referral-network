const AlumniProfile = require('../models/AlumniProfile');
const User = require('../models/User');

const createProfile = async (req, res) => {
  try {
    const existingProfile = await AlumniProfile.findOne({ userId: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }
    const profile = await AlumniProfile.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAlumni = async (req, res) => {
  try {
    const { industry, company, skills, willingToRefer, search } = req.query;
    let query = {};
    if (industry) query.industry = { $regex: industry, $options: 'i' };
    if (company) query.currentCompany = { $regex: company, $options: 'i' };
    if (willingToRefer) query.willingToRefer = willingToRefer === 'true';
    if (skills) query.skills = { $in: skills.split(',') };
    if (search) {
      query.$or = [
        { currentCompany: { $regex: search, $options: 'i' } },
        { currentRole: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    const approvedUsers = await User.find({ isApproved: true, role: 'alumni' }).select('_id');
    const approvedIds = approvedUsers.map(u => u._id);
    query.userId = { $in: approvedIds };
    const profiles = await AlumniProfile.find(query)
      .populate('userId', 'name email profilePicture')
      .sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlumniById = async (req, res) => {
  try {
    const profile = await AlumniProfile.findOne({ userId: req.params.id })
      .populate('userId', 'name email profilePicture');
    if (!profile) {
      return res.status(404).json({ message: 'Alumni profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await AlumniProfile.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleWillingToRefer = async (req, res) => {
  try {
    const profile = await AlumniProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    profile.willingToRefer = !profile.willingToRefer;
    await profile.save();
    res.json({ willingToRefer: profile.willingToRefer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProfile, getAllAlumni, getAlumniById, updateProfile, toggleWillingToRefer };