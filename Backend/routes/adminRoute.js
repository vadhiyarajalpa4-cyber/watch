// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/uploadMiddleware");
// const {getProducts, getProduct, addProduct,updateProduct, deleteProduct} = require("../controllers/productController");
// const {getCategory,createCategory,updateCategory, deleteCategory} = require("../controllers/categoryController");
// const {protect,admin} = require("../middleware/authMiddleware");
// const {toggleWishlist,getWishlistItems} = require("../controllers/wishlistController");

// router.get("/products",getProducts);
// router.get("/products/:id",getProduct);
// router.post("/products",protect,admin,upload.single('image'),addProduct);
// router.put("/products/:id",upload.single('image'),protect,admin,updateProduct);
// router.delete("/products/:id",protect,admin,deleteProduct);

// router.post("/wishlist/toggle", protect, toggleWishlist);
// router.get("/wishlist", protect, getWishlistItems);

// router.get("/category",getCategory);
// router.post("/category",protect,admin,createCategory);
// router.put("/category/:id",protect,admin,updateCategory);
// router.delete("/category/:id",protect,admin,deleteCategory);

// module.exports = router;


const express = require("express");
const router = express.Router();

// 🎯 CHANGED: Destructure both middlewares from your updated upload configuration file
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
// 🎯 CHANGED: Swapped upload.single('image') with uploadWatchImages to parse both 'image' and 'images' fields
router.post("/products", protect, admin, uploadWatchImages, addProduct);
router.put("/products/:id", protect, admin, uploadWatchImages, updateProduct); // Fixed order: middleware runs before auth checks if setup like this, though normally it's: protect, admin, middleware
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