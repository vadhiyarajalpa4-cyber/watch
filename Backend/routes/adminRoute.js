
const express = require("express");
const router = express.Router();

const { upload, uploadWatchImages } = require("../middleware/uploadMiddleware");

const {getProducts, getProduct, addProduct, updateProduct, getRelatedProducts, deleteProduct} = require("../controllers/productController");
const {getCategory, createCategory, updateCategory, deleteCategory} = require("../controllers/categoryController");
const {protect, admin} = require("../middleware/authMiddleware");
const {toggleWishlist, getWishlistItems} = require("../controllers/wishlistController");

// Public Product Routes
router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.get("/products/related/:id",getRelatedProducts);

// Admin Product Routes 
router.post("/products", protect, admin, uploadWatchImages, addProduct);
router.put("/products/:id", protect, admin, uploadWatchImages, updateProduct);
router.delete("/products/:id", protect, admin, deleteProduct);

// Wishlist Routes
router.post("/wishlist/toggle", protect, toggleWishlist);
router.get("/wishlist", protect, getWishlistItems);

// Category Routes
router.get("/category", getCategory);
router.post("/category", protect, admin, createCategory);
router.put("/category/:id", protect, admin, updateCategory);
router.delete("/category/:id", protect, admin, deleteCategory);

module.exports = router;