const express = require("express");
const router = express.Router();
const {protect,admin} = require("../middleware/authMiddleware");
const { 
    getUsers, 
    deleteUser, 
    getUserProfile, 
    updateUserProfile, 
    addAddress,
    updateAddress, 
    deleteAddress 
} = require("../controllers/userController");

router.get("/",protect,admin,getUsers);
router.delete("/:id",protect,admin,deleteUser);

router.get("/profile",protect,getUserProfile);
router.post("/address",protect,addAddress);
router.put("/address/:id",protect,updateAddress);
router.delete("/address/:id",protect,deleteAddress);

module.exports = router;