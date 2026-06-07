const Cart = require("../models/cart");

const addCart = async (req, res) => {
    const { productId, color, price, image, quantity } = req.body;
    
    if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and Quantity are required" });
    }

    const userId = req.user._id;
    const variantKey = `${productId}-${color || 'default'}`;

    try {
        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(p => p.variantKey === variantKey);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += Number(quantity);
            } else {
                cart.items.push({ product: productId, color, price, image, quantity, variantKey });
            }
            await cart.save();
        } else {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, color, price, image, quantity, variantKey }]
            });
        }
        res.status(200).json(cart);
    } catch (err) {
        console.error("ADD_CART_ERROR:", err); 
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name price image'); 
        
        if (!cart) return res.status(200).json([]);
        
        res.status(200).json(cart.items);
    } catch (err) {
        res.status(500).json({ message: "Error fetching cart" });
    }
};

const removeFromCart = async (req, res) => {
    const userId = req.user._id;
    const { variantKey } = req.params;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.variantKey !== variantKey);
        
        await cart.save();
        res.status(200).json(cart.items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateCartQuantity = async (req, res) => {
    const { variantKey, quantity } = req.body; 
    const userId = req.user._id;

    if (!variantKey || !quantity) return res.status(400).json({ message: "Missing fields" });

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(p => p.variantKey === variantKey);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = Math.max(1, Number(quantity));
            await cart.save();
            res.status(200).json(cart.items);
        } else {
            res.status(404).json({ message: "Item not in cart" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

module.exports = { addCart, getCart, removeFromCart, updateCartQuantity };