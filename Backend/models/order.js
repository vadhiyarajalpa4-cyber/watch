const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'product', 
                required: true 
            },
            brand: { type: String },
            style: { type: String },
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }
    },
    // Payment & Tracking Details
    paymentMethod: { 
        type: String, 
        required: true, 
        enum: ['COD', 'Online'], // Restrict to these two types
        default: 'COD' 
    },
    paymentResult: {
        // Storing Razorpay response details for security/reference
        id: { type: String }, // Razorpay Payment ID
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    razorpayOrderId: {
        type: String, // To link with your backend created order
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    
    // Status Trackers
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isShipped: {
        type: Boolean,
        required: true,
        default: false, 
    },
    shippedAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);