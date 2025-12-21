const Notification = require('../models/Notification');

const notifyUser = async (userId, payload) => {
  const notification = await Notification.create({ userId, ...payload });
  return notification;
};

module.exports = { notifyUser };

