const express = require('express');
const router = express.Router();
const { getNotifications, markCategoryAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get("/",protect,getNotifications);
router.put("/mark-read",protect,markCategoryAsRead);
router.put("/mark-all-read",protect,markAllAsRead);

module.exports = router;