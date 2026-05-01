const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['referral_request', 'referral_accepted', 'referral_declined', 'referral_referred', 'new_message', 'profile_approved'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);