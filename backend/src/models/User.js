const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phone: String,
    profilePhoto: String,
    bio: String,
    profileCompletionPercentage: { type: Number, default: 0 },
    userRoles: [{ type: String }],
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    registeredOrganizationType: { type: String },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
