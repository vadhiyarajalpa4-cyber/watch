const Order = require("../models/order");
const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/products");
const sendEmail = require("../utils/sendEmail");
const Notification = require("../models/notification");

// const addOrderItems = async (req, res) => {
//     const {
//         orderItems,
//         shippingAddress,
//         paymentMethod,
//         totalPrice,
//     } = req.body;

//     console.log("--- 1. ORDER REQUEST RECEIVED ---");

//     if (orderItems && orderItems.length === 0) {
//         return res.status(400).json({ message: "No order items" });
//     } else {
//         try {
//             // DEBUG: Is the user actually logged in and recognized?
//             console.log("--- 2. AUTH CHECK ---");
//             console.log("User Object from Middleware:", req.user);

//             if (!req.user) {
//                 console.log("❌ ERROR: req.user is undefined. Check authMiddleware.");
//                 return res.status(401).json({ message: "User not authorized" });
//             }

//             const order = new Order({
//                 orderItems: orderItems.map((item) => ({
//                     ...item,
//                     brand: item.brand || "Standard", 
//                     style: item.style || "Classic",
//                     name: item.name,
//                     product: item.product 
//                 })),
//                 user: req.user._id,
//                 shippingAddress,
//                 paymentMethod,
//                 totalPrice,
//             });

//             console.log("--- 3. SAVING TO DATABASE ---");
//             const createdOrder = await order.save();
//             console.log("✅ DB SAVE SUCCESS: Order ID", createdOrder._id);

//             // 1. AUTO-UPDATE STOCK
//             for (const item of orderItems) {
//                 await Product.findByIdAndUpdate(item.product, {
//                     $inc: { countInStock: -item.quantity }
//                 });
//             }

//             // 2. CLEAR THE CART
//             await Cart.findOneAndDelete({ user: req.user._id });

//             const orderIdShort = createdOrder._id.toString().slice(-8).toUpperCase();

//             // 3. PREPARE EMAILS
//             const customerEmailMsg = `
//                 <div style="font-family: serif; padding: 30px; border: 1px solid #ddd;">
//                     <h1 style="letter-spacing: 2px;">ORDER CONFIRMED</h1>
//                     <p>Dear ${req.user.name},</p>
//                     <p>Your order <b>#${orderIdShort}</b> has been placed successfully.</p>
//                     <p>Total: ₹${totalPrice.toLocaleString()}</p>
//                     <a href="http://localhost:5173/profile" style="color: #D4AF37;">View in My Vault</a>
//                 </div>
//             `;

//             const adminEmailMsg = `
//                 <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9; border-left: 5px solid #D4AF37;">
//                     <h2 style="color: #333;">🚨 New Order Alert</h2>
//                     <hr/>
//                     <p><b>Order ID:</b> #${orderIdShort}</p>
//                     <p><b>Customer:</b> ${req.user.name} (${req.user.email})</p>
//                     <p><b>Amount:</b> ₹${totalPrice.toLocaleString()}</p>
//                     <p><b>Payment:</b> ${paymentMethod}</p>
//                 </div>
//             `;

//             // 4. SEND EMAILS (DEBUGGING SECTION)
//             console.log("--- 4. STARTING EMAIL DISPATCH ---");
//             console.log("Customer Email Target:", req.user.email);
//             const adminRecipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
//             console.log("Admin Email Target:", adminRecipient);

//             try {
//                 // To Customer
//                 console.log("Sending to Customer...");
//                 await sendEmail({
//                     email: req.user.email,
//                     subject: `Order Confirmation #${orderIdShort}`,
//                     message: customerEmailMsg,
//                 });
//                 console.log("✅ Customer Email Sent");

//                 // To Admin
//                 if (adminRecipient) {
//                     console.log("Sending to Admin...");
//                     await sendEmail({
//                         email: adminRecipient,
//                         subject: `NEW ORDER - ₹${totalPrice.toLocaleString()} - ${req.user.name}`,
//                         message: adminEmailMsg,
//                     });
//                     console.log("✅ Admin Email Sent");
//                 } else {
//                     console.log("⚠️ WARNING: No Admin email defined in .env");
//                 }
//             } catch (mailError) {
//                 console.log("❌ MAIL SYSTEM ERROR:", mailError.message);
//             }

//             // 5. SEND RESPONSE
//             console.log("--- 5. SENDING FINAL RESPONSE ---");
//             res.status(201).json(createdOrder);

//         } catch (error) {
//             console.log("❌ CRITICAL ORDER ERROR:", error.message);
//             res.status(500).json({ message: "Order creation failed", error: error.message });
//         }
//     }
// };

const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    } = req.body;

    console.log("--- 1. ORDER REQUEST RECEIVED ---");

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: "No order items" });
    } else {
        try {
            console.log("--- 2. AUTH CHECK ---");
            if (!req.user) {
                console.log("ERROR: req.user is undefined.");
                return res.status(401).json({ message: "User not authorized" });
            }

            console.log("--- 3. DATA DEBUGGING ---");
            console.log("DEBUG: Full orderItems array:", orderItems);
            console.log("DEBUG: First item:", orderItems[0]);

            const order = new Order({
                orderItems: orderItems.map((item) => {
                    // Log the specific image path being evaluated for this item
                    const resolvedImage = item.image || (item.variants && item.variants[0]?.image) || "";
                    console.log("DEBUG: Mapping item", item.name, "| Resolved image:", resolvedImage);

                    return {
                        ...item,
                        brand: item.brand || "Standard",
                        style: item.style || "Classic",
                        name: item.name,
                        product: item.product,
                        image: resolvedImage
                    };
                }),
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                totalPrice,
            });
            // const order = new Order({
            //     orderItems: orderItems.map((item) => ({
            //         ...item,
            //         brand: item.brand || "Standard", 
            //         style: item.style || "Classic",
            //         name: item.name,
            //         product: item.product,
            //         image: item.image || (item.variants && item.variants[0]?.image) || ""
            //     })),
            //     user: req.user._id,
            //     shippingAddress,
            //     paymentMethod,
            //     totalPrice,
            // });

            console.log("--- 3. SAVING TO DATABASE ---");
            const createdOrder = await order.save();
            console.log("DB SAVE SUCCESS: Order ID", createdOrder._id);

            // 1. AUTO-UPDATE STOCK
            for (const item of orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { countInStock: -item.quantity }
                });
            }

            // 2. CLEAR THE CART
            await Cart.findOneAndDelete({ user: req.user._id });

            // --- 🔔 UPDATED: CREATE ADMIN NOTIFICATION ---
            try {
                // Use find (not findOne) if you want to notify multiple admins, 
                // or findOne if you just want to target the main one.
                const admin = await User.findOne({ isAdmin: true });

                if (admin) {
                    await Notification.create({
                        recipient: admin._id, // Fixed: was referencing 'admin' from undefined
                        type: 'NEW_ORDER',
                        message: `New Order: ₹${totalPrice.toLocaleString()} from ${req.user.name}`,
                        link: `/admin/order/${createdOrder._id}`, // Added specific link
                        isRead: true
                    });
                    console.log("Admin Notification Created");
                }
            } catch (notifyError) {
                console.log("Notification Error:", notifyError.message);
            }

            const orderIdShort = createdOrder._id.toString().slice(-8).toUpperCase();

            // 3. PREPARE EMAILS
            const customerEmailMsg = `
                <div style="font-family: serif; padding: 30px; border: 1px solid #ddd;">
                    <h1 style="letter-spacing: 2px;">ORDER CONFIRMED</h1>
                    <p>Dear ${req.user.name},</p>
                    <p>Your order <b>#${orderIdShort}</b> has been placed successfully.</p>
                    <p>Total: ₹${totalPrice.toLocaleString()}</p>
                    <a href="http://localhost:5173/profile" style="color: #D4AF37;">View in My Vault</a>
                </div>
            `;

            const adminEmailMsg = `
                <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9; border-left: 5px solid #D4AF37;">
                    <h2 style="color: #333;">🚨 New Order Alert</h2>
                    <hr/>
                    <p><b>Order ID:</b> #${orderIdShort}</p>
                    <p><b>Customer:</b> ${req.user.name} (${req.user.email})</p>
                    <p><b>Amount:</b> ₹${totalPrice.toLocaleString()}</p>
                    <p><b>Payment:</b> ${paymentMethod}</p>
                </div>
            `;

            // 4. SEND EMAILS
            console.log("--- 4. STARTING EMAIL DISPATCH ---");
            try {
                await sendEmail({
                    email: req.user.email,
                    subject: `Order Confirmation #${orderIdShort}`,
                    message: customerEmailMsg,
                });

                const adminRecipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
                if (adminRecipient) {
                    await sendEmail({
                        email: adminRecipient,
                        subject: `NEW ORDER - ₹${totalPrice.toLocaleString()} - ${req.user.name}`,
                        message: adminEmailMsg,
                    });
                }
            } catch (mailError) {
                console.log("❌ MAIL SYSTEM ERROR:", mailError.message);
            }

            // 5. SEND RESPONSE
            console.log("--- 5. SENDING FINAL RESPONSE ---");
            res.status(201).json(createdOrder);

        } catch (error) {
            console.log("❌ CRITICAL ORDER ERROR:", error.message);
            res.status(500).json({ message: "Order creation failed", error: error.message });
        }
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

const getOrders = async (req, res) => {
    try {
        // 1. Get page and limit from query params, default to page 1, limit 10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 2. Count total orders for the pagination frontend logic
        const totalOrders = await Order.countDocuments({});

        // 3. Fetch orders with pagination
        const orders = await Order.find({})
            .populate('user', 'id name email') // Added email for your table display
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // 4. Send back the paginated data and metadata
        res.json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders
        });
    } catch (error) {
        console.log("FETCH ERROR:", error.message);
        res.status(500).json({ message: "Error fetching orders" });
    }
};
// const updateOrderToShipped = async (req, res) => {
//     const order = await Order.findById(req.params.id);

//     if (order) {
//         order.isShipped = true;
//         order.shippedAt = Date.now();

//         const updatedOrder = await order.save();
//         res.json(updatedOrder);
//     } else {
//         res.status(404);
//         throw new Error('Order not found');
//     }
// };
const updateOrderToShipped = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isShipped = true;
        order.shippedAt = Date.now();

        const updatedOrder = await order.save();

        // --- 🔔 NOTIFY CUSTOMER: ORDER SHIPPED ---
        try {
            await Notification.create({
                recipient: order.user, // Send to the customer
                type: 'ORDER_STATUS',
                message: `Your order #${order._id.toString().slice(-8).toUpperCase()} has been shipped!`,
                link: '/profile', // Or your order details page
                isRead: true
            });
        } catch (err) {
            console.log("Notification Error:", err.message);
        }

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// const updateOrderToDelivered = async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id);

//         if (order) {
//             order.isDelivered = true;
//             order.deliveredAt = Date.now();

//             // 👈 FIX: Matches 'COD' (the value sent from your frontend state)
//             if (order.paymentMethod === 'COD' || order.paymentMethod === 'Cash on Delivery') {
//                 order.isPaid = true;
//                 order.paidAt = Date.now();

//                 // This ensures the "Bill" or "Admin Details" can show 
//                 // who authorized the payment (the Admin)
//                 order.paymentResult = {
//                     id: `COD_CONFIRMED_${Date.now()}`,
//                     status: 'completed',
//                     update_time: new Date().toISOString()
//                 };
//             }

//             const updatedOrder = await order.save();
//             res.json(updatedOrder);
//         } else {
//             res.status(404).json({ message: "Order not found" });
//         }
//     } catch (error) {
//         console.error("DETAILED ERROR:", error.message); 
//         res.status(500).json({ message: error.message || "Update failed" });
//     }
// };

const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            if (order.paymentMethod === 'COD' || order.paymentMethod === 'Cash on Delivery') {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: `COD_CONFIRMED_${Date.now()}`,
                    status: 'completed',
                    update_time: new Date().toISOString()
                };
            }

            const updatedOrder = await order.save();

            // --- 🔔 NOTIFY CUSTOMER: ORDER DELIVERED ---
            try {
                await Notification.create({
                    recipient: order.user,
                    type: 'ORDER_STATUS',
                    message: `Great news! Your order has been delivered. Enjoy your new timepiece!`,
                    link: '/profile',
                    isRead: true
                });
            } catch (err) {
                console.log("Notification Error:", err.message);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("DETAILED ERROR:", error.message);
        res.status(500).json({ message: error.message || "Update failed" });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const allOrders = await Order.find({}).populate('user', 'name'); // Fetching orders
        const totalUsers = await User.countDocuments({});                // Fetching users
        
        const totalRevenue = allOrders.reduce((acc, order) => acc + order.totalPrice, 0);
        const pendingOrders = allOrders.filter(order => !order.isDelivered).length;

        res.json({
            totalRevenue,
            orderCount: allOrders.length,
            pendingOrders,
            userCount: totalUsers,
            rawOrders: allOrders
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};

const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

module.exports = { addOrderItems, getMyOrders, getDashboardStats, getOrders, updateOrderToDelivered, updateOrderToShipped, deleteOrder};