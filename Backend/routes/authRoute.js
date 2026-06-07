const express = require("express");
const router = express.Router();
const {register,login,changePassword,forgotPassword,resetPassword} = require("../controllers/authControllers");
const {protect} = require("../middleware/authMiddleware");


router.post("/register",register);
router.post("/login",login);
router.put("/change-password",protect,changePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;