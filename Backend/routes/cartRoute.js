const express = require('express');
const router = express.Router();
const { addCart, getCart,updateCartQuantity,removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addCart);
router.get('/', protect, getCart);
router.put('/update', protect, updateCartQuantity); 
router.delete('/remove/:variantKey', protect, removeFromCart);

module.exports = router;