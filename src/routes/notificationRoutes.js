const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { getNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/', verifyToken, getNotifications);
router.put('/read', verifyToken, markAsRead);

module.exports = router;