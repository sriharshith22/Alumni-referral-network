const mongoose = require('mongoose');

const referralRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true
  },
  jobURL: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  resume: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'referred'],
    default: 'pending'
  },
  alumniResponse: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('ReferralRequest', referralRequestSchema);