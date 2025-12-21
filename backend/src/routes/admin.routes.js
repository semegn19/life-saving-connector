const express = require('express');
const { auth, requireRoles } = require('../middleware/auth');
const controller = require('../controllers/adminController');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(auth, requireRoles([ROLES.PLATFORM_ADMIN]));

router.get('/users', controller.listUsers);
router.put('/users/:id/block', controller.blockUser);
router.put('/users/:id/unblock', controller.unblockUser);
router.put('/users/:id/activate', controller.activateUser);
router.put('/users/:id/deactivate', controller.deactivateUser);
router.delete('/users/:id', controller.deleteUser);
router.get('/organizations', controller.listOrganizations);
router.post('/organizations/:id/verify', controller.verifyOrganization);
router.post('/organizations/:id/reject', controller.rejectOrganization);
router.get('/ratings', controller.listRatings);
router.post('/ratings/:id/flag', controller.flagRating);
router.delete('/ratings/:id', controller.deleteRating);
router.get('/audit-logs', controller.auditLogs);
router.get('/stats', controller.stats);

module.exports = router;

