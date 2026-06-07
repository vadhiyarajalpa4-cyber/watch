const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['NEW_ORDER', 'NEW_USER', 'ORDER_STATUS', 'NEW_INQUIRY'], 
        required: true 
    },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('notification', notificationSchema);