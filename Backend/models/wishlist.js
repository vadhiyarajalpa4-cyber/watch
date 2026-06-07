const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            variantIndex: {
                type: Number,
                default: 0 
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("wishlist",wishlistSchema);
