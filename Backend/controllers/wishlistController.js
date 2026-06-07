const Wishlist = require("../models/wishlist");

const toggleWishlist = async (req, res) => {
    try {
        const { productId, variantIndex } = req.body;
        const userId = req.user._id;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is missing!" });
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (wishlist) {
            const itemIndex = wishlist.items.findIndex(i => 
                i.product.toString() === productId && i.variantIndex === variantIndex
            );

            if (itemIndex > -1) {
                // Item exists, remove it
                wishlist.items.splice(itemIndex, 1);
            } else {
                // Add new item
                wishlist.items.push({ product: productId, variantIndex: variantIndex || 0 });
            }
            await wishlist.save();
        } else {
            // Create new wishlist if none exists
            wishlist = await Wishlist.create({ 
                user: userId, 
                items: [{ product: productId, variantIndex: variantIndex || 0 }] 
            });
        }
        
        // Return the updated items array so the frontend can update its state instantly
        return res.status(200).json(wishlist.items);
        
    } catch (err) {
        console.error("TOGGLE ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

const getWishlistItems = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishlist = await Wishlist.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name mainImage mainPrice brand variants'
            });

        // Return ONLY the array of items. If no wishlist exists, return an empty array.
        return res.json(wishlist ? wishlist.items : []);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { toggleWishlist, getWishlistItems };