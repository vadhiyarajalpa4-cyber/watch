const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
            color: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            variantKey: { type: String, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("cart", cartSchema);
