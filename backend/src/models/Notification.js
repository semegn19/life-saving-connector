const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: String,
    title: String,
    message: String,
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    read: { type: Boolean, default: false },
    readAt: Date,
    emailSent: { type: Boolean, default: false },
    emailSentAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);

