const { body } = require('express-validator');
const OrganDonor = require('../models/OrganDonor');

const registerValidators = [body('organs').isArray({ min: 1 })];

const register = async (req, res, next) => {
  try {
    const existing = await OrganDonor.findOne({ userId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already registered' });
    const donor = await OrganDonor.create({ userId: req.user.id, registrationStatus: 'pending', ...req.body });
    return res.status(201).json({ donor });
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const donor = await OrganDonor.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true });
    return res.json({ donor });
  } catch (err) {
    return next(err);
  }
};

const status = async (req, res, next) => {
  try {
    const donor = await OrganDonor.findOne({ userId: req.user.id });
    return res.json({ donor });
  } catch (err) {
    return next(err);
  }
};

const publicStats = async (req, res, next) => {
  try {
    const total = await OrganDonor.countDocuments({ registrationStatus: 'approved' });
    return res.json({ totalApprovedDonors: total });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  registerValidators,
  register,
  updateProfile,
  status,
  publicStats,
};

