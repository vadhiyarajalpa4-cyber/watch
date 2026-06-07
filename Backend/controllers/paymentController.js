const Order = require("../models/order");
const Cart = require("../models/cart"); // Adjust path to your schema file
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail");
const User = require("../models/user");
const Notification = require("../models/notification");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Order for Razorpay
exports.createOrder = async (req, res) => {
  try {
    let { amount } = req.body;

    // Razorpay limit for test mode is often ₹1,00,000 (10000000 paise)
    // Let's ensure the amount is a valid number and cap it for testing if needed
    const finalAmount = Math.round(amount * 100); 

    const options = {
      amount: finalAmount, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Sending to Razorpay:", options); // Check this in your terminal!

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log("FULL ERROR LOG:", error);
    res.status(500).json({ success: false, message: error.error.description });
  }
};
exports.verifyAndSaveOrder = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            orderData 
        } = req.body;

        // --- Signature Verification Logic ---
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // --- Save to Database ---
        const newOrder = new Order({
            user: req.user?._id || orderData.user,
            orderItems: orderData.orderItems,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: 'Online',
            totalPrice: orderData.totalPrice,
            isPaid: true,
            paidAt: Date.now(),
            razorpayOrderId: razorpay_order_id,
            paymentResult: {
                id: razorpay_payment_id,
                status: 'success',
                update_time: new Date().toISOString()
            }
        });

        const savedOrder = await newOrder.save();

        if (savedOrder) {
            // 1. Clear Cart
            await Cart.findOneAndDelete({ user: req.user?._id || orderData.user });
            
            const orderIdShort = savedOrder._id.toString().slice(-8).toUpperCase();
            
            // 🔥 FIXED: Define customerName here so BOTH Notifications and Emails can see it
            const customerName = req.user?.name || orderData.name || 'A Customer';

            // ---  CREATE ADMIN NOTIFICATION ---
            try {
                const admins = await User.find({ isAdmin: true });

                if (admins.length > 0) {
                    const notificationPromises = admins.map(admin => 
                        Notification.create({
                            recipient: admin._id,
                            type: 'NEW_ORDER',
                            message: ` Online Payment: ₹${orderData.totalPrice.toLocaleString()} from ${customerName}`,
                            link: '/admin/orders',
                            isRead:true
                        })
                    );
                    await Promise.all(notificationPromises);
                    console.log(` Admin Notifications Created for ${admins.length} admin(s)`);
                }
            } catch (notifyError) {
                console.log(" Bell Notification failed (Online Order):", notifyError.message);
            }
            
            try {
                await sendEmail({
                    email: req.user?.email || orderData.email,
                    subject: `Order Confirmation #${orderIdShort}`,
                    message: `<h1>Payment Received!</h1><p>Thank you for your purchase from Sarvoday Watch Co. Your order #${orderIdShort} is confirmed.</p>`
                });

                const adminRecipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
                if (adminRecipient) {
                    await sendEmail({
                        email: adminRecipient,
                        subject: ` NEW PAID ORDER - #${orderIdShort}`,
                        message: `<p>A new online payment was received from ${customerName}.</p><p>Amount: ₹${orderData.totalPrice.toLocaleString()}</p>`
                    });
                }

                console.log(" Razorpay Order Emails Sent");
            } catch (mailError) {
                console.log("Non-critical Mail Error (Razorpay):", mailError.message);
            }
        }

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: savedOrder
        });

    } catch (error) {
        console.error("SERVER ERROR:", error.message);
        return res.status(500).json({ success: false, message: "Error saving order" });
    }
};