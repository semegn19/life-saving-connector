const User = require('../models/User');
const Organization = require('../models/Organization');
const OrganizationRating = require('../models/OrganizationRating');
const AuditLog = require('../models/AuditLog');

const listUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const filter = search ? { $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
    const users = await User.find(filter).limit(limit).skip(skip).select('-password').sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);
    return res.json({ users, total, page, limit });
  } catch (err) {
    return next(err);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    await AuditLog.create({
      userId: req.user.id,
      action: 'update',
      resource: 'user',
      resourceId: req.params.id,
      changes: { isBlocked: true },
      timestamp: new Date(),
    });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    await AuditLog.create({
      userId: req.user.id,
      action: 'update',
      resource: 'user',
      resourceId: req.params.id,
      changes: { isBlocked: false },
      timestamp: new Date(),
    });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await AuditLog.create({
      userId: req.user.id,
      action: 'delete',
      resource: 'user',
      resourceId: req.params.id,
      timestamp: new Date(),
    });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
};

const activateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    await AuditLog.create({
      userId: req.user.id,
      action: 'update',
      resource: 'user',
      resourceId: req.params.id,
      changes: { isActive: true },
      timestamp: new Date(),
    });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    await AuditLog.create({
      userId: req.user.id,
      action: 'update',
      resource: 'user',
      resourceId: req.params.id,
      changes: { isActive: false },
      timestamp: new Date(),
    });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
};

const listOrganizations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    const orgs = await Organization.find(filter).limit(limit).skip(skip).sort({ createdAt: -1 });
    const total = await Organization.countDocuments(filter);
    return res.json({ organizations: orgs, total, page, limit });
  } catch (err) {
    return next(err);
  }
};

const verifyOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: 'verified', verifiedBy: req.user.id, verifiedAt: new Date() },
      { new: true }
    );
    await AuditLog.create({
      userId: req.user.id,
      action: 'verify',
      resource: 'organization',
      resourceId: req.params.id,
      timestamp: new Date(),
    });
    return res.json({ organization: org });
  } catch (err) {
    return next(err);
  }
};

const rejectOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: 'rejected', verifiedBy: req.user.id, verifiedAt: new Date() },
      { new: true }
    );
    await AuditLog.create({
      userId: req.user.id,
      action: 'reject',
      resource: 'organization',
      resourceId: req.params.id,
      timestamp: new Date(),
    });
    return res.json({ organization: org });
  } catch (err) {
    return next(err);
  }
};

const listRatings = async (req, res, next) => {
  try {
    const ratings = await OrganizationRating.find({}).limit(200);
    return res.json({ ratings });
  } catch (err) {
    return next(err);
  }
};

const flagRating = async (req, res, next) => {
  try {
    const rating = await OrganizationRating.findByIdAndUpdate(
      req.params.id,
      { flagged: req.body.reason || true },
      { new: true }
    );
    return res.json({ rating });
  } catch (err) {
    return next(err);
  }
};

const deleteRating = async (req, res, next) => {
  try {
    await OrganizationRating.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
};

const auditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({}).limit(200).sort({ timestamp: -1 });
    return res.json({ logs });
  } catch (err) {
    return next(err);
  }
};

const stats = async (req, res, next) => {
  try {
    const users = await User.countDocuments();
    const orgs = await Organization.countDocuments();
    const ratings = await OrganizationRating.countDocuments();
    return res.json({ users, organizations: orgs, ratings });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listUsers,
  blockUser,
  unblockUser,
  activateUser,
  deactivateUser,
  deleteUser,
  listOrganizations,
  verifyOrganization,
  rejectOrganization,
  listRatings,
  flagRating,
  deleteRating,
  auditLogs,
  stats,
};

