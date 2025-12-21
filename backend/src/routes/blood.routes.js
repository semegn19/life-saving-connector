const express = require('express');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/bloodController');

const router = express.Router();

router.post('/register', auth, controller.registerValidators, validate, controller.register);
router.put('/profile', auth, controller.updateProfile);
router.get('/centers', auth, controller.listCenters);
router.get('/centers/:id', auth, controller.getCenter);
router.post('/appointments', auth, controller.bookAppointmentValidators, validate, controller.bookAppointment);
router.get('/appointments', auth, controller.listAppointments);
router.put('/appointments/:id', auth, controller.updateAppointment);
router.delete('/appointments/:id', auth, controller.cancelAppointment);

module.exports = router;

