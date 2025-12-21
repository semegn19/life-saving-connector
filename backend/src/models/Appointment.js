const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodDonationCenter', required: true },
    date: { type: Date, required: true },
    status: { type: String, default: 'booked' }, // booked, completed, cancelled
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);


