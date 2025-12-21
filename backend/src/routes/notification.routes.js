const express = require('express');
const { auth } = require('../middleware/auth');
const controller = require('../controllers/notificationController');

const router = express.Router();

router.get('/', auth, controller.list);
router.get('/unread-count', auth, controller.unreadCount);
router.put('/:id/read', auth, controller.markRead);
router.delete('/:id', auth, controller.deleteNotification);
router.put('/read-all', auth, controller.markAllRead);

module.exports = router;

