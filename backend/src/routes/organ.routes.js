const express = require('express');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/organController');

const router = express.Router();

router.post('/register', auth, controller.registerValidators, validate, controller.register);
router.put('/profile', auth, controller.updateProfile);
router.get('/status', auth, controller.status);
router.get('/public-stats', controller.publicStats);

module.exports = router;

