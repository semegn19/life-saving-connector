const { query, body } = require('express-validator');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const VolunteerProfile = require('../models/VolunteerProfile');
const OrganizationRating = require('../models/OrganizationRating');

const listValidators = [
  query('search').optional().isString(),
  query('category').optional().isString(),
  query('urgency').optional().isString(),
];

const listOpportunities = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.urgency) filter.urgency = req.query.urgency;
    const opportunities = await Opportunity.find(filter).limit(50).sort({ createdAt: -1 });
    return res.json({ opportunities });
  } catch (err) {
    return next(err);
  }
};

const getOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Not found' });
    return res.json({ opportunity });
  } catch (err) {
    return next(err);
  }
};

const applyValidators = [
  body('opportunityId').notEmpty(),
  body('motivation').notEmpty(),
];

const apply = async (req, res, next) => {
  try {
    const { opportunityId, motivation, availability } = req.body;
    const existing = await Application.findOne({ opportunityId, userId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already applied' });
    const opportunity = await Opportunity.findById(opportunityId).populate('organizationId');
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    const app = await Application.create({
      opportunityId,
      userId: req.user.id,
      motivation,
      availability,
    });
    await Opportunity.findByIdAndUpdate(opportunityId, { $push: { applicants: app._id } });
    await VolunteerProfile.findOneAndUpdate({ userId: req.user.id }, { $push: { applications: app._id } });
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: req.user.id,
      type: 'opportunity',
      title: 'Application Submitted',
      message: `Your application for "${opportunity.title}" has been submitted successfully.`,
      relatedId: app._id,
    });
    return res.status(201).json({ application: app });
  } catch (err) {
    return next(err);
  }
};

const myApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ applications: apps });
  } catch (err) {
    return next(err);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    if (app.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    app.status = req.body.status || app.status;
    if (req.body.hoursLogged !== undefined) app.hoursLogged = req.body.hoursLogged;
    await app.save();
    return res.json({ application: app });
  } catch (err) {
    return next(err);
  }
};

const withdrawApplication = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    if (app.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await Application.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Withdrawn' });
  } catch (err) {
    return next(err);
  }
};

const logHoursValidators = [body('hours').isNumeric()];

const logHours = async (req, res, next) => {
  try {
    const { hours, applicationId } = req.body;
    const profile = await VolunteerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { volunteeredHours: hours } },
      { new: true }
    );
    if (applicationId) {
      await Application.findByIdAndUpdate(applicationId, { $inc: { hoursLogged: hours } });
    }
    return res.json({ profile });
  } catch (err) {
    return next(err);
  }
};

const rateValidators = [
  body('organizationId').notEmpty(),
  body('ngoLegitimacy').isInt({ min: 1, max: 5 }),
  body('volunteerSupport').isInt({ min: 1, max: 5 }),
  body('professionalism').isInt({ min: 1, max: 5 }),
  body('impact').isInt({ min: 1, max: 5 }),
  body('workEnvironment').isInt({ min: 1, max: 5 }),
];

const rateOrganization = async (req, res, next) => {
  try {
    const { organizationId, opportunityId, ngoLegitimacy, volunteerSupport, professionalism, impact, workEnvironment, comment } = req.body;
    const profile = await VolunteerProfile.findOne({ userId: req.user.id });
    if (!profile || profile.volunteeredHours < 20) {
      return res.status(403).json({ message: 'Need at least 20 volunteer hours to rate' });
    }
    const overallRating = (ngoLegitimacy + volunteerSupport + professionalism + impact + workEnvironment) / 5;
    const rating = await OrganizationRating.create({
      organizationId,
      volunteerId: req.user.id,
      opportunityId,
      ngoLegitimacy,
      volunteerSupport,
      professionalism,
      impact,
      workEnvironment,
      overallRating,
      comment,
      verified: profile.volunteeredHours >= 20,
    });
    if (opportunityId) {
      await Opportunity.findByIdAndUpdate(opportunityId, { $push: { ratings: rating._id } });
      const app = await Application.findOne({ opportunityId, userId: req.user.id });
      if (app) {
        app.rating = rating._id;
        await app.save();
      }
    }
    return res.status(201).json({ rating });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listValidators,
  listOpportunities,
  getOpportunity,
  applyValidators,
  apply,
  myApplications,
  updateApplication,
  withdrawApplication,
  logHoursValidators,
  logHours,
  rateValidators,
  rateOrganization,
};

