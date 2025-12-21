const User = require('../models/User');
const VolunteerProfile = require('../models/VolunteerProfile');
const BloodDonor = require('../models/BloodDonor');
const OrganDonor = require('../models/OrganDonor');

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id && !req.user.roles.includes('platform-admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    return res.json({ user: updated });
  } catch (err) {
    return next(err);
  }
};

const dashboard = async (req, res, next) => {
  try {
    const volunteer = await VolunteerProfile.findOne({ userId: req.params.id });
    const blood = await BloodDonor.findOne({ userId: req.params.id });
    const organ = await OrganDonor.findOne({ userId: req.params.id });
    return res.json({ volunteer, blood, organ });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getUser, updateUser, dashboard };

