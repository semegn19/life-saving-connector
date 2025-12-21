const express = require('express');
const { auth } = require('../middleware/auth');
const controller = require('../controllers/userController');

const router = express.Router();

router.get('/:id', auth, controller.getUser);
router.put('/:id', auth, controller.updateUser);
router.get('/:id/dashboard', auth, controller.dashboard);

module.exports = router;

