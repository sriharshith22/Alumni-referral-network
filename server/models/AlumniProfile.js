const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  graduationYear: {
    type: Number,
    required: [true, 'Graduation year is required']
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true
  },
  currentCompany: {
    type: String,
    required: [true, 'Current company is required'],
    trim: true
  },
  currentRole: {
    type: String,
    required: [true, 'Current role is required'],
    trim: true
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  linkedInURL: {
    type: String,
    default: ''
  },
  willingToRefer: {
    type: Boolean,
    default: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);