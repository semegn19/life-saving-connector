const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    motivation: String,
    availability: String,
    status: { type: String, default: 'pending' },
    appliedAt: { type: Date, default: Date.now },
    respondedAt: Date,
    hoursLogged: { type: Number, default: 0 },
    rating: { type: mongoose.Schema.Types.ObjectId, ref: 'OrganizationRating' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);

