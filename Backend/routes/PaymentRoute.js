const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Path to your auth middleware
const router = express.Router();
const { createOrder, verifyAndSaveOrder } = require('../controllers/paymentController');

// Define the routes and link them to controller functions
router.post('/create-order', createOrder);
router.post('/verify-payment',protect, verifyAndSaveOrder);

module.exports = router;