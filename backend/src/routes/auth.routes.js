const express = require('express');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const controller = require('../controllers/authController');

const router = express.Router();

router.post('/register', controller.registerValidators, validate, controller.register);
router.post('/login', controller.loginValidators, validate, controller.login);
router.get('/me', auth, controller.me);

module.exports = router;

