const mongoose = require('mongoose');

const organizationRatingSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
    ngoLegitimacy: Number,
    volunteerSupport: Number,
    professionalism: Number,
    impact: Number,
    workEnvironment: Number,
    overallRating: Number,
    comment: String,
    organizationResponse: String,
    verified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
    flagged: { type: mongoose.Schema.Types.Mixed, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrganizationRating', organizationRatingSchema);

