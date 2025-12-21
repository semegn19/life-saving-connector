const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const volunteerRoutes = require('./volunteer.routes');
const bloodRoutes = require('./blood.routes');
const organRoutes = require('./organ.routes');
const organizationRoutes = require('./organization.routes');
const adminRoutes = require('./admin.routes');
const notificationRoutes = require('./notification.routes');
const alertRoutes = require('./emergencyAlert.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/blood', bloodRoutes);
router.use('/organ', organRoutes);
router.use('/organizations', organizationRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/emergency-alerts', alertRoutes);

module.exports = router;

