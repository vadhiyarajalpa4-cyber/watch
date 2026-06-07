// const Cart = require("../models/cart");
// const product = require("../models/products");
// const addCart = async (req, res) => {
//     // 1. Extract variantId from body
//     const { productId, variantId, quantity } = req.body;
//     const userId = req.user._id;

//     try {
//         let cart = await Cart.findOne({ user: userId });

//         if (cart) {
//             // 🎯 FIX: Match by variantId, not just productId
//             const itemIndex = cart.items.findIndex(p => 
//                 p.variant && p.variant.toString() === variantId
//             );

//             if (itemIndex > -1) {
//                 cart.items[itemIndex].quantity += Number(quantity);
//             } else {
//                 // 🎯 Pushing variant reference
//                 cart.items.push({ 
//                     product: productId, 
//                     variant: variantId, 
//                     quantity: Number(quantity) 
//                 });
//             }
//             await cart.save();
//             return res.status(201).json(cart);
//         } else {
//             const newCart = await Cart.create({
//                 user: userId,
//                 items: [{ product: productId, variant: variantId, quantity: Number(quantity) }]
//             });
//             return res.status(201).json(newCart);
//         }
//     } catch (err) {
//         console.error("AddCart Error:", err);
//         res.status(500).json({ message: "Server Error", error: err.message });
//     }
// };
// const getCart = async (req, res) => {
//     try {
//         // Populate the entire product document
//         const cart = await Cart.findOne({ user: req.user._id })
//             .populate('items.product'); 
        
//         if (!cart) return res.status(200).json([]);

//         // Map through to attach the specific variant details so the frontend has access
//         const cartWithVariants = cart.items.map(item => {
//             const product = item.product;
//             // Find the specific variant within that product
//             const variantDetails = product.variants.find(v => v._id.toString() === item.variant.toString());
            
//             return {
//                 ...item.toObject(),
//                 variantDetails: variantDetails // This gives the frontend the color/price/image
//             };
//         });

//         res.status(200).json(cartWithVariants);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching cart" });
//     }
// };
// const removeFromCart = async (req, res) => {
//     const userId = req.user._id;
//     const { variantId } = req.params;

//     if (!variantId) return res.status(400).json({ message: "Variant ID required" });

//     try {
//         const cart = await Cart.findOne({ user: userId });
//         if (!cart) return res.status(404).json({ message: "Cart not found" });

//         cart.items = cart.items.filter(item => item.variant.toString() !== variantId);
        
//         await cart.save();
//         res.status(200).json({ message: "Item removed", items: cart.items });
//     } catch (err) {
//         res.status(500).json({message:err.message});
//      }
// };

// const updateCartQuantity = async (req, res) => {
//     // 🎯 CHANGE: Use variantId instead of productId
//     const { variantId, quantity } = req.body; 
//     const userId = req.user._id;

//     try {
//         const cart = await Cart.findOne({ user: userId });
//         if (!cart) return res.status(404).json({ message: "Cart not found" });

//         // 🎯 CHANGE: Match by variant, not product
//         const itemIndex = cart.items.findIndex(p => p.variant.toString() === variantId);

//         if (itemIndex > -1) {
//             cart.items[itemIndex].quantity = Math.max(1, quantity);
//             await cart.save();
//             res.status(200).json(cart);
//         } else {
//             res.status(404).json({ message: "Variant not in cart" });
//         }
//     } catch (err) {
//         res.status(500).json({ message: "Server Error", error: err.message });
//     }
// };

// const addCart = async (req, res) => {
//     // 1. Ensure values are extracted correctly
//     const { productId, quantity } = req.body;
//     const userId = req.user._id;

//     try {
//         let cart = await Cart.findOne({ user: userId });

//         if (cart) {
//             // FIX 1: Defensive check for p.product to prevent .toString() crash
//             const itemIndex = cart.items.findIndex(p => 
//                 p.product && p.product.toString() === productId
//             );

//             if (itemIndex > -1) {
//                 // FIX 2: Ensure quantity is treated as a Number to avoid concatenation
//                 cart.items[itemIndex].quantity += Number(quantity);
//             } else {
//                 // Ensure we are pushing an object that matches the Schema
//                 cart.items.push({ product: productId, quantity: Number(quantity) });
//             }
            
//             await cart.save(); // 'cart = await cart.save()' is also fine
//             return res.status(201).json(cart);
//         } else {
//             // Create new cart for user
//             const newCart = await Cart.create({
//                 user: userId,
//                 items: [{ product: productId, quantity: Number(quantity) }]
//             });
//             return res.status(201).json(newCart);
//         }
//     } catch (err) {
//         // Log the actual error to your terminal so you can see it
//         console.error("AddCart Error:", err);
//         res.status(500).json({ message: "Server Error", error: err.message });
//     }
// };

// const getCart = async(req,res) =>{
//    try {
//         const cart = await Cart.findOne({ user: req.user._id }).populate({path: 'items.product',
//             select: 'name price image brand style countInStock'});
//         if (!cart) return res.status(200).json([]);
//         res.status(200).json(cart.items);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching cart" });
//     }
// };

// const updateCartQuantity = async(req,res)=>{
//     const { productId, quantity } = req.body; // quantity will be the new total (e.g., 3)
//     const userId = req.user._id;

//     try {
//         const cart = await Cart.findOne({ user: userId });
//         if (!cart) return res.status(404).json({ message: "Cart not found" });

//         const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

//         if (itemIndex > -1) {
//             // Ensure quantity doesn't go below 1
//             cart.items[itemIndex].quantity = Math.max(1, quantity);
//             await cart.save();
//             res.status(200).json(cart);
//         } else {
//             res.status(404).json({ message: "Product not in cart" });
//         }
//     } catch (err) {
//         res.status(500).json({ message: "Server Error", error: err.message });
//     }
// };

// const removeFromCart = async(req,res)=>{
//     const userId = req.user._id;
//     const { productId } = req.params;

//     try {
//         const cart = await Cart.findOne({ user: userId });
//         if (!cart) return res.status(404).json({ message: "Cart not found" });

//         // Filter out the product
//         cart.items = cart.items.filter(item => item.product.toString() !== productId);
        
//         await cart.save();
//         res.status(200).json({ message: "Item removed", cart });
//     } catch (err) {
//         res.status(500).json({ message: "Server Error", error: err.message });
//     }
// };

// module.exports = {addCart,getCart,updateCartQuantity,removeFromCart};

const Cart = require("../models/cart");

const addCart = async (req, res) => {
    const { productId, color, price, image, quantity } = req.body;
    
    // 1. ADD VALIDATION
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
            // If this line fails, your Schema likely requires a field you aren't providing
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, color, price, image, quantity, variantKey }]
            });
        }
        res.status(200).json(cart);
    } catch (err) {
        // 2. THIS WILL LOG THE REAL ERROR TO YOUR TERMINAL
        console.error("ADD_CART_ERROR:", err); 
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const getCart = async (req, res) => {
    try {
        // Populate name, price, and image so the frontend has them
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name price image'); 
        
        if (!cart) return res.status(200).json([]);
        
        res.status(200).json(cart.items);
    } catch (err) {
        res.status(500).json({ message: "Error fetching cart" });
    }
};

// In removeFromCart
const removeFromCart = async (req, res) => {
    const userId = req.user._id;
    const { variantKey } = req.params; // Expecting the variantKey in the URL

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        // Filter out the item that matches the variantKey
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