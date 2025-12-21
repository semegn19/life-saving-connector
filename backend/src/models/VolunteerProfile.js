const mongoose = require('mongoose');

const volunteerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skills: [String],
    availability: String,
    volunteeredHours: { type: Number, default: 0 },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    completedAssignments: [{ type: mongoose.Schema.Types.ObjectId }],
    badges: [String],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrganizationRating' }],
    organizationRatings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrganizationRating' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('VolunteerProfile', volunteerProfileSchema);

