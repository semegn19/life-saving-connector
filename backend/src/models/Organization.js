const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    email: String,
    phone: String,
    website: String,
    registrationNumber: String,
    description: String,
    logo: String,
    address: String,
    country: String,
    adminUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    averageRating: Number,
    totalRatings: Number,
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrganizationRating' }],
    verificationStatus: { type: String, default: 'pending' },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);

