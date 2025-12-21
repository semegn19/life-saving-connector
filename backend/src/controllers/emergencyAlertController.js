const { body } = require('express-validator');
const EmergencyAlert = require('../models/EmergencyAlert');

const createValidators = [body('bloodNeeded').notEmpty(), body('urgency').notEmpty()];

const create = async (req, res, next) => {
  try {
    const alert = await EmergencyAlert.create({ ...req.body, initiatedBy: req.user.id, status: 'active' });
    return res.status(201).json({ alert });
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await EmergencyAlert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ alert: updated });
  } catch (err) {
    return next(err);
  }
};

const respond = async (req, res, next) => {
  try {
    const alert = await EmergencyAlert.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { respondents: req.user.id }, $inc: { respondentCount: 1 } },
      { new: true }
    );
    return res.json({ alert });
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const alerts = await EmergencyAlert.find({ status: 'active' }).sort({ createdAt: -1 });
    return res.json({ alerts });
  } catch (err) {
    return next(err);
  }
};

module.exports = { createValidators, create, update, respond, list };

