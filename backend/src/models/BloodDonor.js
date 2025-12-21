const mongoose = require('mongoose');

const bloodDonorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bloodType: String,
    donationFrequency: String,
    preferredCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodDonationCenter' },
    donationHistory: [
      {
        date: Date,
        units: Number,
        location: String,
      },
    ],
    totalDonations: { type: Number, default: 0 },
    nextEligibleDate: Date,
    emergencyAlertOptIn: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodDonor', bloodDonorSchema);

