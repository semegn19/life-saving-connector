const express = require('express');
const { auth, requireRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/organizationController');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.post('/', auth, controller.createValidators, validate, controller.create);
router.put('/:id', auth, controller.update);
router.get('/:id', auth, controller.getOrg);
router.get('/:id/dashboard', auth, controller.dashboard);
router.post(
  '/verify/:id',
  auth,
  requireRoles([ROLES.PLATFORM_ADMIN]),
  controller.verify
);
router.get('/pending', auth, requireRoles([ROLES.PLATFORM_ADMIN]), controller.listPending);
router.get('/:id/opportunities/:oppId/applications', auth, controller.listOpportunityApplications);
router.put('/:id/applications/:appId/accept', auth, controller.acceptApplication);
router.put('/:id/applications/:appId/reject', auth, controller.rejectApplication);

module.exports = router;

