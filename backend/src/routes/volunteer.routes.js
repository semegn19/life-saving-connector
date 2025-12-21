const express = require('express');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/volunteerController');

const router = express.Router();

router.get('/opportunities', auth, controller.listValidators, validate, controller.listOpportunities);
router.get('/opportunities/:id', auth, controller.getOpportunity);
router.post('/apply', auth, controller.applyValidators, validate, controller.apply);
router.get('/my-applications', auth, controller.myApplications);
router.put('/applications/:id', auth, controller.updateApplication);
router.delete('/applications/:id', auth, controller.withdrawApplication);
router.post('/hours', auth, controller.logHoursValidators, validate, controller.logHours);
router.post('/rate', auth, controller.rateValidators, validate, controller.rateOrganization);

module.exports = router;

