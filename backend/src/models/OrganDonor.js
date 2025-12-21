const mongoose = require('mongoose');

const organDonorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    organs: [String],
    registrationStatus: { type: String, default: 'pending' },
    adminApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminApprovedAt: Date,
    rejectionReason: String,
    emergencyContact: String,
    nextOfKin: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrganDonor', organDonorSchema);

