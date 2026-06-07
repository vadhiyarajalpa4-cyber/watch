const express = require("express");
const router = express.Router();
const { protect,admin } = require('../middleware/authMiddleware');
const {addOrderItems,getMyOrders,getDashboardStats, getOrders, updateOrderToDelivered, updateOrderToShipped, deleteOrder} = require("../controllers/orderController");


router.get("/stats", protect, admin, getDashboardStats);

router.post("/",protect,addOrderItems);
router.get("/myorders", protect, getMyOrders);
router.get("/:id",protect,getMyOrders);
router.get("/",protect,admin,getOrders);
router.put("/:id/deliver",protect,admin,updateOrderToDelivered);
router.put("/:id/ship",protect, admin, updateOrderToShipped);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;

