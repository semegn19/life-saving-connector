const express = require('express');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/emergencyAlertController');

const router = express.Router();

router.post('/', auth, controller.createValidators, validate, controller.create);
router.put('/:id', auth, controller.update);
router.post('/:id/respond', auth, controller.respond);
router.get('/', auth, controller.list);

module.exports = router;

