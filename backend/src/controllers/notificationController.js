const Notification = require('../models/Notification');

const list = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ notifications });
  } catch (err) {
    return next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true, readAt: new Date() },
      { new: true }
    );
    return res.json({ notification: updated });
  } catch (err) {
    return next(err);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { read: true, readAt: new Date() });
    return res.json({ message: 'All read' });
  } catch (err) {
    return next(err);
  }
};

const unreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user.id, read: false });
    return res.json({ count });
  } catch (err) {
    return next(err);
  }
};

module.exports = { list, markRead, deleteNotification, markAllRead, unreadCount };

