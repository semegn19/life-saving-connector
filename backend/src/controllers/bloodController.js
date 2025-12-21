const { body } = require('express-validator');
const BloodDonor = require('../models/BloodDonor');
const BloodDonationCenter = require('../models/BloodDonationCenter');
const Appointment = require('../models/Appointment');

const registerValidators = [body('bloodType').notEmpty()];

const register = async (req, res, next) => {
  try {
    const existing = await BloodDonor.findOne({ userId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already registered' });
    const donor = await BloodDonor.create({ userId: req.user.id, ...req.body });
    return res.status(201).json({ donor });
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const donor = await BloodDonor.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true });
    return res.json({ donor });
  } catch (err) {
    return next(err);
  }
};

const listCenters = async (req, res, next) => {
  try {
    const centers = await BloodDonationCenter.find({}).limit(100);
    return res.json({ centers });
  } catch (err) {
    return next(err);
  }
};

const getCenter = async (req, res, next) => {
  try {
    const center = await BloodDonationCenter.findById(req.params.id);
    if (!center) return res.status(404).json({ message: 'Not found' });
    return res.json({ center });
  } catch (err) {
    return next(err);
  }
};

const bookAppointmentValidators = [body('centerId').notEmpty(), body('date').notEmpty()];

const bookAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      userId: req.user.id,
      centerId: req.body.centerId,
      date: req.body.date,
      status: 'booked',
    });
    const Notification = require('../models/Notification');
    const center = await BloodDonationCenter.findById(req.body.centerId);
    await Notification.create({
      userId: req.user.id,
      type: 'donation',
      title: 'Appointment Confirmed',
      message: `Your blood donation appointment at ${center?.name || 'center'} is confirmed for ${new Date(req.body.date).toLocaleDateString()}.`,
      relatedId: appointment._id,
    });
    return res.status(201).json({ appointment });
  } catch (err) {
    return next(err);
  }
};

const listAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate('centerId', 'name address city')
      .sort({ date: 1 });
    return res.json({ appointments });
  } catch (err) {
    return next(err);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    if (appointment.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    if (req.body.date) appointment.date = req.body.date;
    if (req.body.status) appointment.status = req.body.status;
    await appointment.save();
    return res.json({ appointment });
  } catch (err) {
    return next(err);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    if (appointment.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    appointment.status = 'cancelled';
    await appointment.save();
    return res.json({ message: 'Cancelled' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  registerValidators,
  register,
  updateProfile,
  listCenters,
  getCenter,
  bookAppointmentValidators,
  bookAppointment,
  listAppointments,
  updateAppointment,
  cancelAppointment,
};

