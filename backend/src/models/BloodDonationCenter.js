const mongoose = require('mongoose');

const bloodDonationCenterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    city: String,
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
    },
    phone: String,
    email: String,
    hours: String,
    services: [String],
    adminOrganizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    inventory: {
      'O+': Number,
      'O-': Number,
      'A+': Number,
      'A-': Number,
      'B+': Number,
      'B-': Number,
      'AB+': Number,
      'AB-': Number,
    },
    urgency: String,
    averageWaitTime: Number,
    capacity: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodDonationCenter', bloodDonationCenterSchema);

