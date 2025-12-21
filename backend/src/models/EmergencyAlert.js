const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema(
  {
    bloodNeeded: {
      type: String,
    },
    units: Number,
    urgency: String,
    location: String,
    initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    targetRadius: Number,
    respondentCount: { type: Number, default: 0 },
    status: { type: String, default: 'active' },
    respondents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    emailsSent: { type: Number, default: 0 },
    emailsOpened: { type: Number, default: 0 },
    appointmentsBooked: { type: Number, default: 0 },
    closedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);

