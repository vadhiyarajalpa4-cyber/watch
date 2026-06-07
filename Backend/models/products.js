const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
    brand: { type: String, required: true },
    style: { type: String, required: true },
    warranty: { type: String, default: "1 Year International Warranty" },

    variants: [{
        color: { type: String, required: true }, // e.g., "Blue", "Green"
        hexCode: { type: String, default: "#000000" },
        price: { type: Number, required: true },
        discountPrice: { type: Number, default: 0 },
        countInStock: { type: Number, default: 0 },
        image: { type: String, required: false }, 
        images: [String]
    }]
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
 });

 productSchema.virtual('mainImage').get(function() {
    return this.variants && this.variants.length > 0 ? this.variants[0].image : null;
});

productSchema.virtual('mainPrice').get(function() {
    return this.variants && this.variants.length > 0 ? this.variants[0].price : null;
});

module.exports = mongoose.model("product", productSchema);