const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    title: { type: String, required: true },
    description: String,
    category: String,
    hoursPerWeek: Number,
    urgency: String,
    location: String,
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
    },
    isRemote: Boolean,
    tags: [String],
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    status: { type: String, default: 'open' },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrganizationRating' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);

