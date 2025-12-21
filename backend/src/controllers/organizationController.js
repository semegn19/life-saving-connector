const { body } = require('express-validator');
const Organization = require('../models/Organization');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { ROLES } = require('../config/constants');

const createValidators = [body('name').notEmpty(), body('type').notEmpty()];

const create = async (req, res, next) => {
  try {
    const org = await Organization.create({ ...req.body, adminUsers: [req.user.id], verificationStatus: 'pending' });
    return res.status(201).json({ organization: org });
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: 'Not found' });
    const isAdmin = org.adminUsers.map(String).includes(req.user.id) || req.user.roles.includes(ROLES.PLATFORM_ADMIN);
    if (!isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const updated = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ organization: updated });
  } catch (err) {
    return next(err);
  }
};

const getOrg = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: 'Not found' });
    return res.json({ organization: org });
  } catch (err) {
    return next(err);
  }
};

const dashboard = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ organizationId: req.params.id }).countDocuments();
    return res.json({ opportunities });
  } catch (err) {
    return next(err);
  }
};

const verify = async (req, res, next) => {
  try {
    const updated = await Organization.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: 'verified', verifiedBy: req.user.id, verifiedAt: new Date() },
      { new: true }
    );
    return res.json({ organization: updated });
  } catch (err) {
    return next(err);
  }
};

const listPending = async (req, res, next) => {
  try {
    const pending = await Organization.find({ verificationStatus: 'pending' });
    return res.json({ organizations: pending });
  } catch (err) {
    return next(err);
  }
};

const listOpportunityApplications = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    const isAdmin = org.adminUsers.map(String).includes(req.user.id) || req.user.roles.includes(ROLES.PLATFORM_ADMIN);
    if (!isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const opportunity = await Opportunity.findById(req.params.oppId);
    if (!opportunity || opportunity.organizationId.toString() !== req.params.id) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    const applications = await Application.find({ opportunityId: req.params.oppId })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    return res.json({ applications });
  } catch (err) {
    return next(err);
  }
};

const acceptApplication = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    const isAdmin = org.adminUsers.map(String).includes(req.user.id) || req.user.roles.includes(ROLES.PLATFORM_ADMIN);
    if (!isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const application = await Application.findById(req.params.appId);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    const opportunity = await Opportunity.findById(application.opportunityId);
    application.status = 'approved';
    application.respondedAt = new Date();
    await application.save();
    await Notification.create({
      userId: application.userId,
      type: 'opportunity',
      title: 'Application Approved',
      message: `Your application for "${opportunity?.title || 'opportunity'}" has been approved.`,
      relatedId: application._id,
    });
    return res.json({ application });
  } catch (err) {
    return next(err);
  }
};

const rejectApplication = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    const isAdmin = org.adminUsers.map(String).includes(req.user.id) || req.user.roles.includes(ROLES.PLATFORM_ADMIN);
    if (!isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const application = await Application.findById(req.params.appId);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    const opportunity = await Opportunity.findById(application.opportunityId);
    application.status = 'rejected';
    application.respondedAt = new Date();
    await application.save();
    await Notification.create({
      userId: application.userId,
      type: 'opportunity',
      title: 'Application Rejected',
      message: `Your application for "${opportunity?.title || 'opportunity'}" has been rejected.`,
      relatedId: application._id,
    });
    return res.json({ application });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createValidators,
  create,
  update,
  getOrg,
  dashboard,
  verify,
  listPending,
  listOpportunityApplications,
  acceptApplication,
  rejectApplication,
};

