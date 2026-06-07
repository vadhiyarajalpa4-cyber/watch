const express = require("express");
const router = express.Router();
const {createInquiry, 
        getInquiries,
        updateInquiryStatus,
        deleteInquiry,
        replyToInquiry
        } = require("../controllers/contactController");
const {protect,admin}  = require("../middleware/authMiddleware");

router.post("/",createInquiry);
router.get("/",protect, admin, getInquiries);
router.put("/:id",protect,admin, updateInquiryStatus);
router.delete("/:id",protect, admin, deleteInquiry);
router.post("/:id/reply",protect, admin, replyToInquiry);

module.exports = router;