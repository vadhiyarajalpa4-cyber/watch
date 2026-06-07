const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const { createOrder, verifyAndSaveOrder } = require('../controllers/paymentController');

router.post('/create-order', createOrder);
router.post('/verify-payment',protect, verifyAndSaveOrder);

module.exports = router;